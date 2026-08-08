import type { Block } from '@/lib/types';
import HeadingBlock from './blocks/HeadingBlock';
import TextBlock from './blocks/TextBlock';
import CardBlock from './blocks/CardBlock';
import ButtonBlock from './blocks/ButtonBlock';
import ImageBlock from './blocks/ImageBlock';
import InputBlock from './blocks/InputBlock';
import FormBlock from './blocks/FormBlock';
import NotificationBlock from './blocks/NotificationBlock';
import DividerBlock from './blocks/DividerBlock';

export default function BlockRenderer({ block, userId }: { block: Block; userId?: string }) {
  switch (block.type) {
    case 'heading':
      return <HeadingBlock config={block.config} />;
    case 'text':
      return <TextBlock config={block.config} />;
    case 'card':
      return <CardBlock config={block.config} />;
    case 'button':
      return <ButtonBlock config={block.config} />;
    case 'image':
      return <ImageBlock config={block.config} />;
    case 'input':
      return <InputBlock block={block} userId={userId} />;
    case 'form':
      return <FormBlock block={block} userId={userId} />;
    case 'notification':
      return <NotificationBlock config={block.config} />;
    case 'divider':
      return <DividerBlock />;
    default:
      return null;
  }
}
