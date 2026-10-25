import Editor, { type OnMount } from '@monaco-editor/react';
import { CircleChevronLeftIcon } from 'lucide-react';
import { editorSimpleOptions } from '>/config';
import { cx } from '>/services/utils';

type EditorSectionProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  value: string;
  onMount: OnMount;
};

export const RoleEditSection = ({
  title,
  isOpen,
  onToggle,
  value,
  onMount,
}: EditorSectionProps) => (
  <div className={cx(isOpen && 'active-item')}>
    <div className='one-line' onClick={onToggle}>
      <h4 className='area-subtitle'>{title}</h4>
      <CircleChevronLeftIcon
        size={20}
        className={`icon-muted transition-transform duration-300 ${
          isOpen ? '-rotate-90' : ''
        }`}
      />
    </div>
    <div className={cx('area-content edit', !isOpen && 'hidden')}>
      <Editor
        onMount={onMount}
        value={value}
        language='markdown'
        options={editorSimpleOptions}
      />
    </div>
  </div>
);
