"use client"

import { SocialModal } from "@/components/modals/social-modal";
// import { StoreModal } from "@/components/modals/store-modal";
import { useEffect, useState } from "react"

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            {/* <StoreModal /> */}
            <SocialModal />
        </>
    )
}