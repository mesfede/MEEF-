const fs = require('fs');

let content = fs.readFileSync('src/components/PropertyDetailModal.tsx', 'utf8');

if (!content.includes('getInstagramEmbedUrl')) {
  // Add helper function inside the file before component or inside component
  const helperCode = `
const getInstagramEmbedUrl = (url?: string): string | null => {
  if (!url) return null;
  const match = url.match(/instagram\\.com\\/(?:p|reel|reels)\\/([A-Za-z0-9_-]+)/);
  if (match && match[1]) {
    return \`https://www.instagram.com/p/\${match[1]}/embed/\`;
  }
  return null;
};
`;

  content = helperCode + content;

  // Replace video section
  const oldVideoBlock = `{property.videoUrl ? (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-16/9 shadow-lg border border-zinc-800">
                  <video
                    src={property.videoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (`;

  const newVideoBlock = `{(() => {
                const videoOrIgUrl = property.instagramUrl || property.videoUrl;
                const igEmbedUrl = getInstagramEmbedUrl(videoOrIgUrl);

                if (igEmbedUrl) {
                  return (
                    <div className="relative rounded-2xl overflow-hidden bg-black h-[480px] shadow-lg border border-zinc-800 flex items-center justify-center">
                      <iframe
                        src={igEmbedUrl}
                        className="w-full h-full border-0 rounded-2xl"
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        allowFullScreen
                        title="Instagram Reel"
                      />
                    </div>
                  );
                }

                if (property.videoUrl) {
                  return (
                    <div className="relative rounded-2xl overflow-hidden bg-black aspect-16/9 shadow-lg border border-zinc-800">
                      <video
                        src={property.videoUrl}
                        controls
                        autoPlay
                        loop
                        className="w-full h-full object-contain"
                      />
                    </div>
                  );
                }

                return null;
              })() || (`;

  if (content.includes(oldVideoBlock)) {
    content = content.replace(oldVideoBlock, newVideoBlock);
    fs.writeFileSync('src/components/PropertyDetailModal.tsx', content);
    console.log("Successfully updated PropertyDetailModal.tsx with Reel embed support");
  } else {
    console.log("Could not find oldVideoBlock in PropertyDetailModal.tsx");
  }
}
