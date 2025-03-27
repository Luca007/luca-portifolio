interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  topics: string[];
  created_at: string;
  updated_at: string;
  language: string;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
}

interface GithubPagesRepo {
  id: number;
  name: string;
  description: string;
  githubUrl: string;
  demoUrl: string;
  topics: string[];
  lastUpdated: string;
  language: string;
  stars: number;
  imageUrl: string;
}

/**
 * Fetches GitHub Pages repositories for a specific user
 */
export async function fetchGithubPagesProjects(username: string): Promise<GithubPagesRepo[]> {
  try {
    // Fetch user repositories
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      },
      cache: 'no-store' // Disable cache to get fresh data each time
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: Repository[] = await response.json();

    // Filter for GitHub Pages repositories
    // Look for repos that:
    // - are not forks
    // - are not archived
    // - have a homepage URL (GitHub Pages)
    // - or have "github.io" in the name
    const githubPagesRepos = repos.filter(repo =>
      !repo.fork &&
      !repo.archived &&
      (repo.homepage || repo.name.includes("github.io") || repo.name.includes("github-pages"))
    );

    // Transform to our format
    return await Promise.all(githubPagesRepos.map(async repo => {
      // Try to fetch an image for the repository
      let imageUrl = `/images/projects/default-project.jpg`;

      // Try to fetch repository content to look for screenshots
      try {
        const contentResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/contents`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (contentResponse.ok) {
          const contents = await contentResponse.json();

          // Look for image folders or screenshot files
          const imageDirectories = ['screenshots', 'images', 'assets', 'public'];

          // Find an image directory
          const imageDir = contents.find((item: any) =>
            imageDirectories.includes(item.name.toLowerCase()) &&
            item.type === 'dir'
          );

          if (imageDir) {
            // Fetch contents of the image directory
            const imagesResponse = await fetch(imageDir.url, {
              headers: {
                'Accept': 'application/vnd.github.v3+json'
              }
            });

            if (imagesResponse.ok) {
              const images = await imagesResponse.json();

              // Find an image file (prefer screenshots or images with screenshot in the name)
              const screenshotFile = images.find((img: any) =>
                (img.name.toLowerCase().includes('screenshot') ||
                 img.name.toLowerCase().includes('preview')) &&
                (img.name.endsWith('.png') ||
                 img.name.endsWith('.jpg') ||
                 img.name.endsWith('.jpeg') ||
                 img.name.endsWith('.gif'))
              );

              if (screenshotFile) {
                imageUrl = screenshotFile.download_url;
              } else {
                // Take any image if no screenshot is found
                const anyImage = images.find((img: any) =>
                  img.name.endsWith('.png') ||
                  img.name.endsWith('.jpg') ||
                  img.name.endsWith('.jpeg') ||
                  img.name.endsWith('.gif')
                );

                if (anyImage) {
                  imageUrl = anyImage.download_url;
                }
              }
            }
          } else {
            // Look for image files in the root
            const imageFile = contents.find((file: any) =>
              (file.name.toLowerCase().includes('screenshot') ||
               file.name.toLowerCase().includes('preview') ||
               file.name.toLowerCase().includes('image')) &&
              (file.name.endsWith('.png') ||
               file.name.endsWith('.jpg') ||
               file.name.endsWith('.jpeg') ||
               file.name.endsWith('.gif'))
            );

            if (imageFile) {
              imageUrl = imageFile.download_url;
            }
          }
        }
      } catch (error) {
        console.error(`Error fetching images for ${repo.name}:`, error);
        // Continue with default image
      }

      return {
        id: repo.id,
        name: repo.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), // Format name
        description: repo.description || `Project built with ${repo.language || 'web technologies'}`,
        githubUrl: repo.html_url,
        demoUrl: repo.homepage || `https://${username}.github.io/${repo.name}`,
        topics: repo.topics || [],
        lastUpdated: new Date(repo.updated_at).toLocaleDateString(),
        language: repo.language || 'HTML',
        stars: repo.stargazers_count,
        imageUrl: imageUrl
      };
    }));
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    return [];
  }
}
