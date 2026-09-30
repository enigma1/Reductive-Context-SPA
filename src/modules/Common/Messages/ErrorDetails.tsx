import { ApiError } from '>/types';
type Props = {
  error: ApiError;
};

export const ErrorDetails = ({ error }: Props) => (
  <>
    <h3>{error.error}</h3>
    <p className='text-sm'>{error.message}</p>
    {error.details && (
      <ul>
        {error.details.map((detail, idx) => (
          <li key={`error-detail${idx}`}>{detail}</li>
        ))}
      </ul>
    )}
  </>
);
