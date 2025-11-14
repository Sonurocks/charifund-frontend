'use client';

import { ContactUsSocialMedia } from "@/src/staticResource";
import { InfoItem } from "@/src/types";
import React from "react";
import { useTranslation } from "react-i18next";

const ContactInfoBlock: React.FC<InfoItem> = ({
  icon: Icon,
  title,
  lines,
  links,
  isSocial,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-4 items-start">
      <Icon className="text-brown text-xl mt-1" />
      <div>
        <h4 className="font-nunito font-extrabold text-lg mb-2 ">{t(title)}</h4>

        {isSocial ? (
          <div className="flex gap-2 mt-2">
            {ContactUsSocialMedia.map((item, index) => {
              const SocialIcon = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border cursor-pointer border-gray-400 rounded-full flex items-center justify-center text-muted-gray hover:bg-yellow hover:text-white hover:border-yellow transition"
                >
                  <SocialIcon className="text-sm" />
                </a>
              );
            })}
          </div>
        ) : (
          lines?.map((line, i) => {
            const link = links?.[i];

            return link ? (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-nunito cursor-pointer  text-base text-muted-gray leading-relaxed hover:text-yellow transition block"
              >
                {t(line)}
              </a>
            ) : (
              <p
                key={i}
                className="font-nunito text-base text-muted-gray leading-relaxed"
              >
                {t(line)}
              </p>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ContactInfoBlock;
