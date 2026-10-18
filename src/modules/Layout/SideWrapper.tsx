import { useRef, ComponentType } from 'react';
import { useConfigStore } from '>/services/stores';
import { startSidebarResize } from '>/services/hooks';

type SideWrapperProps = {
  component: ComponentType;
};

export const SideWrapper = ({ component: Component }: SideWrapperProps) => {
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const { sidebarWidth, setSidebarWidth } = useConfigStore(
    ({ state, api }) => ({
      sidebarWidth: state.sidebarWidth,
      setSidebarWidth: api.setSidebarWidth,
    }),
  );

  return (
    <div
      ref={sidebarRef}
      className='sidebar-wrapper'
      style={{ width: sidebarWidth }}
    >
      <aside>
        <Component />
      </aside>
      <div
        className='resize-handle'
        onPointerDown={(e) =>
          startSidebarResize({
            e,
            sidebarRef,
          })
        }
        onPointerUp={() => {
          if (sidebarRef.current) {
            const width = sidebarRef.current.getBoundingClientRect().width;
            setSidebarWidth(width);
          }
        }}
      />
    </div>
  );
};
