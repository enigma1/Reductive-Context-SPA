import { useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Logo from '>/assets/images/reductive-context-xp.svg?react';
import { messageStoreActions, useAppStore } from '>/services/stores';
import { routes } from '>/config';

const formatDuration = (d: Temporal.Duration) => {
  const total = Math.floor(d.total({ unit: 'seconds' }));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const NetworkDown = () => {
  const [startedAt] = useState(() => Temporal.Now.instant());
  const [_, setToggle] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const online = useAppStore(({ state }) => state.online);

  const redirectPath = useMemo(() => {
    const from = location.state?.from;
    return from && from !== routes.front.networkDown ? from : routes.front.home;
  }, [location.state]);

  useEffect(() => {
    const id = setInterval(() => {
      setToggle((t) => !t); // force re-render every sec
    }, 1000);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!online) {
      return;
    }

    const duration = Temporal.Now.instant().since(startedAt);
    if (duration.total({ unit: 'seconds' }) >= 3) {
      messageStoreActions.addMessage({
        type: 'success',
        content: {
          text: `Network connectivity restored after ${formatDuration(Temporal.Now.instant().since(startedAt))}`,
          duration: 8000,
        },
      });
    }

    navigate(redirectPath, {
      replace: true,
    });
  }, [online, redirectPath]);

  const duration = Temporal.Now.instant().since(startedAt);
  const durationFormatted = formatDuration(duration);
  return (
    <>
      <div className='page-container items-center justify-center h-screen'>
        <div className='page-content justify-center items-center'>
          <a
            href='https://github.com/enigma1/Reductive-Context-SPA'
            target='_blank'
          >
            <Logo className='text-logo' />
          </a>
          <h1 className='page-title text-2xl font-bold mt-4'>Network Down</h1>
          <div className='page-section bg-transparent max-w-lg'>
            <p className='central'>
              Backend is offline or misconfigured and cannot connect to a valid
              back endpoint. System will automatically reconnect once
              connectivity is restored.
            </p>
          </div>
          <p className='flex justify-center text-3xl font-mono'>
            {durationFormatted}
          </p>
        </div>
      </div>
    </>
  );
};
