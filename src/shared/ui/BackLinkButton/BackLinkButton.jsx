import RouterLink from '@/shared/ui/RouterLink';
import Button2 from '@/shared/ui/Button';

const BackLinkButton = ({ children, to = '/', variant = 'outline', size = 'small', ...props }) => {
  return (
    <RouterLink to={to}>
      <Button2 variant={variant} size={size} {...props}>
        {children}
      </Button2>
    </RouterLink>
  );
};

export default BackLinkButton;