interface YouTubePlayerProps {
	youtubeLink: string;
	youtubeTitle: string | undefined;
}

export default function YouTubePlayer({ youtubeLink, youtubeTitle }: YouTubePlayerProps) {
	function embeddedLink(): string | null {
		// Regular expression to match YouTube video IDs
		const regex =
			/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

		// Extract video ID from the link
		const match = youtubeLink.match(regex);

		if (match && match[1]) {
			const videoId = match[1];
			// Construct the embedded link
			return `https://www.youtube.com/embed/${videoId}`;
		}

		// Return null if the link doesn't match the expected format
		return null;
	}

	return (
		<div className="flex aspect-auto h-full">
			<div id="app"></div>
			<iframe
				allowFullScreen
				src={embeddedLink()!}
				title={youtubeTitle ?? youtubeLink}
				className="h-auto w-full rounded-lg"
			/>
		</div>
	);
}
