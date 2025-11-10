import AvatarPlaceholder from "@/assets/avatar-placeholder.png";
import TipTapEditorWithHeader from "@/components/tip-tap-editor/tip-tap-editor-with-header";
import {
  FormControl,
  FormDescription,
  FormField,
  FormFooter,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { EmployeeSchema } from "@/lib/validation";
import CropImageDialog from "@/utils/crop-image-dialog";
import { useUploadThing } from "@/utils/uplaodthing";
import { SelectLabel } from "@radix-ui/react-select";
import { CameraIcon, LucideIcon, User2Icon, UserIcon } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import FileResizer from "react-image-file-resizer";
import { toast } from "sonner";
import { upsertStaffPersonalInformationMutation } from "./mutations/personal-information";

interface PersonalInformationProps {
  form: UseFormReturn<EmployeeSchema>;
}

export default function PersonalInformation({
  form,
}: PersonalInformationProps) {
  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);
  const { startUpload: startAvatarUpload, isUploading } =
    useUploadThing("notMyAvatar");
  const isMobile = useIsMobile();

  const { mutate, isPending } = upsertStaffPersonalInformationMutation();

  const avatarName =
    form.watch("personalInformation.username") ||
    form.watch("personalInformation.name");
  const userId = form.watch("personalInformation.id");

  async function submitCroppedImage(image: Blob | null) {
    toast("submitting avatarUrl");
    if (image) {
      const newAvatarFile = new File([image], `avatar_${avatarName}.webp`);
      const uploadResult = await startAvatarUpload([newAvatarFile], { userId });
      const onlineAvatarUrl = uploadResult?.[0].serverData.avatarUrl;
      form.setValue("personalInformation.avatarUrl", onlineAvatarUrl);
    }
  }

  return (
    <div className="flex flex-col max-w-7xl md:justify-between md:flex-row gap-4">
      {/* User profile information  */}
      <div className="">
        <AvatarInput
          src={
            croppedAvatar
              ? URL.createObjectURL(croppedAvatar)
              : form.watch("personalInformation.avatarUrl") || AvatarPlaceholder
          }
          size={isMobile ? 200 : 450}
          onImageCropped={(image) => {
            setCroppedAvatar(image);
            submitCroppedImage(image);
          }}
        />
        {isUploading && (
          <div className=" flex justify-center items-center text-muted-foreground text-center">
            <Spinner className="inline-flex mr-1.5" />
            Uploading profile image
          </div>
        )}
      </div>
      {/* Other information  */}
      <div className="space-y-4 w-full max-w-2xl">
        <FormField
          name="personalInformation.name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Staff full name</FormLabel>
              <FormControl>
                <Input placeholder="enter staff full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="personalInformation.email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Staff email</FormLabel>
              <FormControl>
                <Input
                  placeholder="enter staff email"
                  type="email"
                  {...field}
                  value={field.value!}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="personalInformation.gender"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select value={field.value!} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <FormControl>
                    <SelectValue
                      placeholder="Please choose a gender"
                      defaultValue={field.value!}
                    />
                  </FormControl>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Genders</SelectLabel>
                    {genders.map((g) => {
                      const Icon = g.icon;
                      return (
                        <SelectItem key={g.value} value={g.value}>
                          <div className="flex gap-2">
                            <Icon /> {g.value}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="personalInformation.telephone"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Staff Telephone</FormLabel>
              <FormControl>
                <Input
                  placeholder="enter staff phone number"
                  type="tel"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Start with country code. e.g., +256772345678
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          name="personalInformation.bio"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio information</FormLabel>
              <FormControl>
                <TipTapEditorWithHeader
                  includeHeader={false}
                  onTextChanged={field.onChange}
                  initialContent={field.value!}
                  placeholder="write a short bio about staff self."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormFooter>
          <LoadingButton
            loading={isPending}
            variant={"secondary"}
            onClick={() => {
              mutate(form.watch("personalInformation"));
            }}
          >
            Safe Draft: Personal Information
          </LoadingButton>
        </FormFooter>
      </div>
    </div>
  );
}

const genders: { value: string; icon: LucideIcon }[] = [
  { value: "Male", icon: UserIcon },
  { value: "Female", icon: User2Icon },
];

interface AvatarInputProps {
  src: string | StaticImageData;
  size?: number;
  onImageCropped: (blob: Blob | null) => void;
}

function AvatarInput({ src, size = 250, onImageCropped }: AvatarInputProps) {
  const [imageToCrop, setImageToCrop] = useState<File>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  function onImageSelected(image: File | undefined) {
    if (!image) return;

    FileResizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (url) => setImageToCrop(url as File),
      "file"
    );
  }
  const theSize = `${size / 4}px`;
  const iconSize = `${size / 4 / 2}px`;
  return (
    <div className="max-w-fit mx-auto w-full">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelected(e.target.files?.[0])}
        className="sr-only hidden"
        ref={fileInputRef}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group hover:cursor-pointer relative block rounded-full"
      >
        <Image
          src={src}
          alt="Avatar preview"
          width={size}
          height={size}
          className=" flex-none rounded-full object-cover"
        />
        <span
          style={
            {
              "--the-size": theSize,
              "--icon-size": iconSize,
            } as React.CSSProperties
          }
          className="absolute inset-0 m-auto flex size-(--the-size) items-center justify-center rounded-full bg-black opacity-30 text-white transition-colors duration-200 group-hover:opacity-25"
        >
          <CameraIcon size={40} className="size-(--icon-size)" />
        </span>
      </button>

      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={1}
          onCropped={onImageCropped}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        />
      )}
    </div>
  );
}
