import { useEffect, useState, useCallback } from "react";
import { AxiosError } from "axios";
import { getFriendsApi } from "../api/friendApi";
import type { Friend } from "../types/friend.types";

interface UseFriendsOptions {
    status?: string;
    search?: string;
}

export default function useFriends({
    status,
    search,
}: UseFriendsOptions = {}) {

    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFriends = useCallback(async () => {
        setLoading(true);

        try {
            const res = await getFriendsApi({
                status,
                search,
            });

            setFriends(res.data.data.friends);
            setError(null);
        } catch (err) {
            const message =
                err instanceof AxiosError
                    ? err.message
                    : "Failed to load friends";

            setError(message);
        } finally {
            setLoading(false);
        }
    }, [status, search]);

    useEffect(() => {
        fetchFriends();
    }, [fetchFriends]);

    return {
        friends,
        loading,
        error,
        refresh: fetchFriends,
    };
}