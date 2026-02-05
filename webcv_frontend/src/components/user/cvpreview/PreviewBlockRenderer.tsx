import React from "react";
import { CVBlock } from "@/types/cv";
import PersonalInfo from "../cv-builder/PersonalInfoBlock";
import ActivityBlock from "../cv-builder/ActivityBlock";
import AwardBlock from "../cv-builder/Awards";
import BusinessCard from "../cv-builder/BusinessCard";
import CertificateBlock from "../cv-builder/CertificateBlock";
import EducationBlock from "../cv-builder/EducationBlock";
import ExperienceBlock from "../cv-builder/ExperienceBlock";
import CareerObjectiveBlock from "../cv-builder/CareerObjectiveBlock";
import SkillBlock from "../cv-builder/SkillBlock";
import AvatarUpload from "../cv-builder/AvatarUpload";

type Props = {
  block: CVBlock;
  readOnly?: boolean;
};

export default function PreviewBlockRenderer({ block, readOnly = false }: Props) {
  switch (block.type) {
    case "profile":
      return <PersonalInfo blockId={block.id} readOnly={readOnly} />;

    case "activity":
      return <ActivityBlock blockId={block.id} readOnly={readOnly} />;

    case "award":
      return <AwardBlock blockId={block.id} readOnly={readOnly} />;

    case "businesscard":
      return <BusinessCard blockId={block.id} readOnly={readOnly} />;

    case "certificate":
      return <CertificateBlock blockId={block.id} readOnly={readOnly} />;

    case "education":
      return <EducationBlock blockId={block.id} readOnly={readOnly} />;

    case "experience":
      return <ExperienceBlock blockId={block.id} readOnly={readOnly} />;

    case "career":
      return <CareerObjectiveBlock blockId={block.id} readOnly={readOnly} />;

    case "skill":
      return <SkillBlock blockId={block.id} readOnly={readOnly} />;

    case "avatar":
      return <AvatarUpload blockId={block.id} readOnly={readOnly} />;
    default:
      return (
        <div className="text-sm text-gray-400 italic">
          Chưa hỗ trợ block: {block.type}
        </div>
      );
  }
}
