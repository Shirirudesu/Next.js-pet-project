import { createContext, useContext, useMemo } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const UserContext = createContext(null);

const fetcher = async (url) => {
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok || json?.success === false) {
    throw new Error(json?.error || "Failed to load user");
  }
  return json.data;
};

export function UserProvider({ children }) {
  const { data: session, status } = useSession();
  const email = session?.user?.email;

  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR(email ? `/api/user/${encodeURIComponent(email)}` : null, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const value = useMemo(() => {
    const credits = user?.credits ?? 0;
    const unlockedArticles = user?.unlockedArticles ?? [];

    const setCreditsLocal = (nextCredits) =>
      mutate(
        (prev) => ({
          ...(prev || {}),
          credits: nextCredits,
        }),
        { revalidate: false },
      );

    const addUnlockedArticleLocal = (articleId) =>
      mutate(
        (prev) => {
          const prevUnlocked = prev?.unlockedArticles ?? [];
          const nextUnlocked = prevUnlocked.includes(articleId)
            ? prevUnlocked
            : [...prevUnlocked, articleId];

          return {
            ...(prev || {}),
            unlockedArticles: nextUnlocked,
          };
        },
        { revalidate: false },
      );

    return {
      status,
      email,
      user: user || null,
      isLoading,
      error: error || null,
      credits,
      unlockedArticles,
      refreshUser: () => mutate(),
      setCreditsLocal,
      addUnlockedArticleLocal,
    };
  }, [email, error, isLoading, mutate, status, user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within <UserProvider />");
  }
  return ctx;
}
