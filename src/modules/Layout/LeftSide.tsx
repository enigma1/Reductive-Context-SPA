import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { MessageSquarePlusIcon, CircleChevronLeftIcon } from 'lucide-react';
import {
  dialogStoreActions,
  useConfigStore,
  useCodeStore,
} from '>/services/stores';
import { dialogFactories, BundleSideList } from '>/modules';
import { routes } from '>/config';

export const LeftSide = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    routes.front.bundleList,
  );
  const navigate = useNavigate();
  const location = useLocation();

  const { activeFile, activeBundleId, addSelectedFile, setActiveFile } =
    useCodeStore(({ api, state }) => ({
      activeBundleId: state.activeBundleId,
      activeFile: state.activeFile,
      setActiveFile: api.setActiveFile,
      addSelectedFile: api.addSelectedFile,
    }));

  type SidebarSection = {
    id: string;
    getTitle: () => string;
    getRoute: () => string;
    component: ReactNode;
    icon: ReactNode;
  };

  const sideSections: SidebarSection[] = [
    {
      id: 'conversations',
      getTitle: () => {
        return activeBundleId ? `Bundle: ${activeBundleId}` : 'Conversations';
      },
      getRoute: () => routes.front.bundleList,
      component: <BundleSideList />,
      icon: (
        <span title='New Conversation'>
          <MessageSquarePlusIcon
            size={20}
            onClick={() => {
              dialogStoreActions.openDialog({
                payload: dialogFactories.setFilePaths(),
              });
            }}
          />
        </span>
      ),
    },
  ];

  const toggleSection = async (section: SidebarSection) => {
    setExpandedSection(section.id);
    const route = section.getRoute();
    if (route && location.pathname !== route) {
      navigate(route);
    }
  };

  useEffect(() => {
    toggleSection(sideSections[0]);
  }, []);

  return (
    <>
      {sideSections.map((section) => {
        const isActive = expandedSection === section.id;
        return (
          <section
            key={section.id}
            className='side-accordion'
            data-open={isActive}
          >
            <div className='side-accordion-header'>
              <button
                onClick={() => toggleSection(section)}
                className='side-accordion-trigger'
              >
                <span className='flex items-center gap-2'>
                  {section.icon}
                  <span>{section.getTitle()}</span>
                </span>

                <CircleChevronLeftIcon
                  size={20}
                  className={`icon-muted transition-transform duration-300 ${
                    isActive ? '-rotate-90' : ''
                  }`}
                />
              </button>
            </div>

            <div className='side-accordion-content'>
              <div>{section.component}</div>
            </div>
          </section>
        );
      })}
    </>
  );
};
