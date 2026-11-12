import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  CpuAiIcon,
  CircleChevronLeftIcon,
  UserRoundPlusIcon,
  DiagramFlowHorizontalIcon,
  WorkflowIcon,
} from 'lucide-react';
import {
  dialogStoreActions,
  useConfigStore,
  useCodeStore,
  flowStoreActions,
} from '>/services/stores';
import {
  dialogFactories,
  BundleSideList,
  RoleSideList,
  McpSideList,
  FlowSideList,
} from '>/modules';
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
        return activeBundleId ? `Bundle: ${activeBundleId}` : 'Bundles';
      },
      getRoute: () => routes.front.bundleList,
      component: <BundleSideList />,
      icon: (
        <span title="New Bundle">
          <CpuAiIcon
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
    {
      id: 'flows',
      getTitle: () => {
        return 'Workflows';
      },
      getRoute: () => routes.front.flowView,
      component: <FlowSideList />,
      icon: (
        <span title="New Flow">
          <DiagramFlowHorizontalIcon
            size={20}
            onClick={() => {
              flowStoreActions.setCurrentFlow();
              if (location.pathname !== routes.front.flowView) {
                navigate(routes.front.flowView);
              }
            }}
          />
        </span>
      ),
    },

    {
      id: 'roles',
      getTitle: () => {
        return 'Roles';
      },
      getRoute: () => {
        return location.pathname === routes.front.flowView
          ? routes.front.flowView
          : routes.front.roleList;
      },
      component: <RoleSideList />,
      icon: (
        <span title="New Role">
          <UserRoundPlusIcon
            size={20}
            onClick={() => {
              dialogStoreActions.openDialog({
                payload: dialogFactories.setRole(),
              });
            }}
          />
        </span>
      ),
    },
    {
      id: 'mcps',
      getTitle: () => {
        return 'MCP Services';
      },
      getRoute: () => {
        return location.pathname === routes.front.flowView
          ? routes.front.flowView
          : routes.front.mcpList;
      },
      component: <McpSideList />,
      icon: (
        <span title="New MCP Service">
          <WorkflowIcon
            size={20}
            onClick={() => {
              dialogStoreActions.openDialog({
                payload: dialogFactories.setMcp(),
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
    // toggleSection(sideSections[0]);
  }, []);

  return (
    <>
      {sideSections.map((section) => {
        const isActive = expandedSection === section.id;
        return (
          <section
            key={section.id}
            className="side-accordion"
            data-open={isActive}
          >
            <div className="side-accordion-header">
              <button
                onClick={() => toggleSection(section)}
                className="side-accordion-trigger"
              >
                <span className="flex items-center gap-2">
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

            <div className="side-accordion-content">
              <div>{section.component}</div>
            </div>
          </section>
        );
      })}
    </>
  );
};
