import { useEffect } from 'react';

const LegacyStyles = () => {
    useEffect(() => {
        const styles = [
            '/css/main.css',
            '/css/custom.css'
        ];

        const links = [];

        styles.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            // Add a data attribute to identify easily
            link.dataset.legacy = "true";
            document.head.appendChild(link);
            links.push(link);
        });

        return () => {
            links.forEach(link => {
                if (link.parentNode) {
                    link.parentNode.removeChild(link);
                }
            });
        };
    }, []);

    return null;
};

export default LegacyStyles;
