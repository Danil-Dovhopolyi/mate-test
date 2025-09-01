import { MetaItem } from "@/controllers/recruiterProfile/recruiterProfile.hooks.ts/useRecruiterProfileMetaItems";
import { RecruiterProfileMetaItems } from "@/controllers/recruiterProfile/recruiterProfile.typedefs";
import { IconLocation } from "@/ui/icons/general/IconLocation";
import typography from "@/ui/typography/typography.module.scss";
import cn from "classnames";
import React from "react";
import styles from "./ProfileMeta.module.scss";

interface Props {
  items: MetaItem[];
}
export const RecruiterProfileMeta = React.memo<Props>((props) => {
  const { items } = props;

  return (
    <ul className={styles.metaWrapper}>
      {items.map((item) => {
        const isCity = item.name === RecruiterProfileMetaItems.City;

        return (
          <li
            className={cn(styles.recruiterMetaItem, typography.smallHeading)}
            key={item.name}
          >
            {isCity && <IconLocation />}
            {item.text}
          </li>
        );
      })}
    </ul>
  );
});
