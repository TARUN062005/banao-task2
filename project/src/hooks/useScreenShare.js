import { useState, useCallback, useEffect, useRef } from "react";

export const useScreenShare = () => {
    const [stream, setStream] = useState(null);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);

    const streamRef = useRef(null);

    // Ref mirrors status to avoid stale-closure reads inside async callbacks
    const statusRef = useRef(status);
    useEffect(() => { statusRef.current = status; }, [status]);

    const cleanup = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.onended = null;
                track.stop();
            });
            streamRef.current = null;
        }
        setStream(null);
    }, []);

    const startSharing = useCallback(async () => {
        // ⭐ Double-launch protection — prevent concurrent picker attempts
        if (statusRef.current === "requesting") return;

        cleanup();
        setError(null);

        if (!navigator.mediaDevices?.getDisplayMedia) {
            setStatus("unsupported");
            return;
        }

        setStatus("requesting");

        try {
            const mediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: { frameRate: { ideal: 30 } },
                audio: false,
            });

            const videoTrack = mediaStream.getVideoTracks()[0];

            videoTrack.onended = () => {
                cleanup();
                setStatus("ended");
            };

            streamRef.current = mediaStream;
            setStream(mediaStream);
            setStatus("granted");

        } catch (err) {
            cleanup();

            if (err.name === "AbortError") {
                setStatus("cancelled");
                setError("Screen selection was cancelled.");
            } else if (err.name === "NotAllowedError") {
                setStatus("denied");
                setError("Permission was denied by the user or browser policy.");
            } else if (err.name === "NotFoundError") {
                setStatus("error");
                setError("No suitable screen capture source was found.");
            } else if (err.name === "NotReadableError") {
                setStatus("error");
                setError("Screen source could not be accessed. It may be in use by another app.");
            } else if (err.name === "OverconstrainedError") {
                setStatus("error");
                setError("The requested capture constraints could not be satisfied.");
            } else if (err.name === "SecurityError") {
                setStatus("error");
                setError("Screen capture blocked. Ensure the page is active and try again.");
            } else {
                setStatus("error");
                setError("An unexpected error occurred. Please try again.");
            }
        }
    }, [cleanup]);

    const stopSharing = useCallback(() => {
        cleanup();
        setStatus("ended");
    }, [cleanup]);

    const reset = useCallback(() => {
        cleanup();
        setStatus("idle");
        setError(null);
    }, [cleanup]);

    useEffect(() => {
        return cleanup;
    }, [cleanup]);

    return { stream, status, error, startSharing, stopSharing, reset };
};
