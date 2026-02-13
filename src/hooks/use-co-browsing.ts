
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useCoBrowsing = () => {
    const router = useRouter();

    const scrollToSection = useCallback((sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            return true;
        }
        return false;
    }, []);

    const highlightElement = useCallback((selector: string) => {
        const element = document.querySelector(selector);
        if (element) {
            const originalOutline = (element as HTMLElement).style.outline;
            const originalTransition = (element as HTMLElement).style.transition;

            (element as HTMLElement).style.transition = 'outline 0.3s ease';
            (element as HTMLElement).style.outline = '4px solid #22c55e'; // Green highlight

            setTimeout(() => {
                (element as HTMLElement).style.outline = originalOutline;
                (element as HTMLElement).style.transition = originalTransition;
            }, 2000);
            return true;
        }
        return false;
    }, []);

    const navigate = useCallback((path: string) => {
        router.push(path);
        return true;
    }, [router]);

    const fillForm = useCallback((selector: string, value: string) => {
        const element = document.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement;
        if (element) {
            element.value = value;
            // Trigger change event for React controlled inputs if needed
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        }
        return false;
    }, []);

    return {
        scrollToSection,
        highlightElement,
        navigate,
        fillForm
    };
};
