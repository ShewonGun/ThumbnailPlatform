import type { AspectRatio, IThumbnail } from "../../public/assets/assets"

const PreviewPanel = ({thumbnail, isLoading, aspectRatio} : 
{thumbnail: IThumbnail, isLoading: boolean, aspectRatio: AspectRatio}
) => {

    const aspectClasses = {
        '16:9': 'aspect-video',
        '1:1': 'aspect-square',
        '9:16': 'aspect-[9/16]',
    } as Record<AspectRatio, string>;

  return (
    <div className="relative mx-auto w-full max-w-2xl">
        <div className={`relative overflow-hidden ${aspectClasses[aspectRatio]}`}></div>
    </div>
  )
}

export default PreviewPanel