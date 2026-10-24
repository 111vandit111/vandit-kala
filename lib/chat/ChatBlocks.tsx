import React from "react";
import type { ProfileType } from "../server/limits";
import type { ChatBlock } from "../chatReply";
import LinkButtons from "./LinkButtons";
import ProjectCards from "./ProjectCards";
import SkillCards from "./SkillCards";

interface ChatBlocksProps {
  blocks: ChatBlock[];
  type: ProfileType;
  onNavigate?: () => void;
}

const renderBlock = (block: ChatBlock, type: ProfileType, onNavigate?: () => void) => {
  switch (block.type) {
    case "projects":
      return <ProjectCards projects={block.projects} type={type} onNavigate={onNavigate} />;
    case "skills":
      return <SkillCards skills={block.skills} type={type} onNavigate={onNavigate} />;
    case "links":
      return (
        <div data-chat-bubble="links" className="chat-grad-links min-w-0 max-w-full rounded-2xl p-3">
          <LinkButtons links={block.links} label="Links" showIcon />
        </div>
      );
    case "socials":
      return <LinkButtons links={block.links} label="Social links" />;
    case "contact":
      return <LinkButtons links={block.links} label="Contact" contactHref={`/${type}#contact`} onNavigate={onNavigate} />;
    default:
      return null;
  }
};

const ChatBlocks = ({ blocks, type, onNavigate }: ChatBlocksProps) => {
  if (blocks.length === 0) return null;
  return (
    <div className="flex min-w-0 max-w-full flex-col gap-3">
      {blocks.map((block, index) => (
        <div key={`${block.type}-${index}`} className="min-w-0 max-w-full">
          {renderBlock(block, type, onNavigate)}
        </div>
      ))}
    </div>
  );
};

export default ChatBlocks;
