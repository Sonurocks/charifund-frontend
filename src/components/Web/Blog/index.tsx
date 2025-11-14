'use client'
import React from 'react';
import { latestnewsbanner } from '@/public/assets'
import { useTranslation } from 'react-i18next';
import BlogGrid from './BlogGrid';
import PageBanner from '@/src/helper/PageBanner';

const Blog = () => {
    const { t } = useTranslation();

    return (
        <div>
            <PageBanner
                bgImage={latestnewsbanner}
                tagline={t("Start Donating Poor People")}
                title={t("Our Blog")}
                smallIcon="mdi:hand-heart"
                decoIcon="mdi:ribbon"
                decoPosition="absolute bottom-10 left-10"
            />
            <BlogGrid />
        </div>
    )
}

export default Blog
