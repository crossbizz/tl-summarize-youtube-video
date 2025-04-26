import { useQuery } from "@tanstack/react-query";
import keys from "./keys";
import apiConfig from "./apiConfig";

export function useGetVideos(indexId) {
  return useQuery({
    queryKey: [keys.VIDEOS, indexId],
    queryFn: async () => {
      try {
        const response = await apiConfig.SERVER.get(
          `${apiConfig.INDEXES_URL}/${indexId}/videos`,
          {
            params: { page_limit: apiConfig.PAGE_LIMIT },
          }
        );
        return response.data;
      } catch (error) {
        return error;
      }
    },
  });
}

export function useGetVideo(indexId, videoId, enabled) {
  return useQuery({
    queryKey: [keys.VIDEOS, indexId, videoId],
    queryFn: async () => {
      try {
        if (!enabled) {
          return null;
        }
        const response = await apiConfig.SERVER.get(
          `${apiConfig.INDEXES_URL}/${indexId}/videos/${videoId}`
        );

        if (response.data.error) {
          throw new Error(response.data.error);
        }

        return response.data;
      } catch (error) {
        throw error;
      }
    },
    enabled: enabled,
    onError: (error) => {
      console.error("useGetVideo hook error:", error);
    },
  });
}

export async function fetchVideoInfo(queryClient, url) {
  try {
    const response = await queryClient.fetchQuery({
      queryKey: [keys.VIDEO, url],
      queryFn: async () => {
        const response = await apiConfig.SERVER.get(
          `/video-info?url=${encodeURIComponent(url)}`
        );
        const respData = response.data;
        return respData;
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching video information:", error);
    throw error;
  }
}

/**
 * Generates a summary for a video by posting data to the unified generate endpoint.
 *
 * @param {object} data - The data required for summary generation.
 * @param {string} videoId - The ID of the video to summarize.
 * @param {boolean} enabled - Whether the query should be executed.
 * @returns {object|null} The response data from the summary generation endpoint, or null if not enabled.
 */
export function useGenerateSummary(data, videoId, enabled) {
  return useQuery({
    queryKey: [keys.VIDEOS, "generate", videoId],
    queryFn: async () => {
      if (!enabled) {
        return null;
      }

      const response = await apiConfig.SERVER.post(
        `/videos/${videoId}/generate`,
        { data }
      );
      const respData = response.data;
      return respData;
    },
    enabled: enabled,
  });
}

/**
 * Generates chapters for a video by posting data to the unified generate endpoint.
 *
 * @param {object} data - The input data required for chapter generation.
 * @param {string} videoId - The ID of the video for which chapters are generated.
 * @param {boolean} enabled - Determines whether the query should be executed.
 * @returns {object|null} The response data containing generated chapters, or null if not enabled.
 */
export function useGenerateChapters(data, videoId, enabled) {
  return useQuery({
    queryKey: [keys.VIDEOS, "generate", videoId],
    queryFn: async () => {
      if (!enabled) {
        return null;
      }

      const response = await apiConfig.SERVER.post(
        `/videos/${videoId}/generate`,
        { data }
      );
      const respData = response.data;
      return respData;
    },
    enabled: enabled,
  });
}

/**
 * Generates video highlights by posting data to the unified generate endpoint.
 *
 * Initiates a request to create highlights for a specific video when enabled. Returns the response data from the API or `null` if not enabled.
 *
 * @param {object} data - The payload containing information required to generate highlights.
 * @param {string} videoId - The unique identifier of the video for which highlights are generated.
 * @param {boolean} enabled - Determines whether the query should be executed.
 * @returns {object|null} The API response data with generated highlights, or `null` if not enabled.
 */
export function useGenerateHighlights(data, videoId, enabled) {
  return useQuery({
    queryKey: [keys.VIDEOS, "generate", videoId],
    queryFn: async () => {
      if (!enabled) {
        return null;
      }

      const response = await apiConfig.SERVER.post(
        `/videos/${videoId}/generate`,
        { data }
      );
      const respData = response.data;
      return respData;
    },
    enabled: enabled,
  });
}

export function useGetTask(taskId) {
  return useQuery({
    queryKey: [keys.TASK, taskId],
    queryFn: () =>
      apiConfig.SERVER.get(`${apiConfig.TASKS_URL}/${taskId}`).then(
        (res) => res.data
      ),
    refetchInterval: (data) => {
      return data?.status === "ready" || data?.status === "failed"
        ? false
        : 5000;
    },
    refetchIntervalInBackground: true,
  });
}
