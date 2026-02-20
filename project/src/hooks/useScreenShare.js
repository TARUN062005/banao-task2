import { useState, useCallback, useEffect, useRef } from "react";

// Status values (spec-exact):
// idle | requesting | granted | denied | cancelled | error | ended | unsupported

export const useScreenShare = () => {
    const [stream, setStream] = useState(null);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);

    const streamRef = useRef(null);

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
        cleanup();
        setError(null);

        // Guard first — before touching status
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

            // Detect browser-toolbar "Stop sharing" click
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

    // Release all resources when component unmounts
    useEffect(() => {
        return cleanup;
    }, [cleanup]);

    return { stream, status, error, startSharing, stopSharing, reset };
};
