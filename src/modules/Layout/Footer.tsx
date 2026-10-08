export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='wrapper'>{`Reductive Context Workspace - Copyright (c) ${currentYear} Mark Samios`}</footer>
  );
};
