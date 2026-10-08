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
                tagline={t("Creating Awareness • Inspiring Change")}
                title={t("Our Stories & Updates")}
                description={t("Read about our initiatives, community programs, social-impact activities, and the people whose lives we are working to make a positive difference in.")}
                smallIcon="mdi:hand-heart"
                decoIcon="mdi:ribbon"
                decoPosition="absolute bottom-10 left-10"
            />
            <BlogGrid />
        </div>
    )
}

export default Blog
