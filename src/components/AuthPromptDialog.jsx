import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import PropTypes from 'prop-types';

const AuthPromptDialog = ({ isOpen, onOpenChange, message }) => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign in required</DialogTitle>
          <DialogDescription>
            {message || "Please sign in or create an account to use this feature"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 mt-4">
          <Button onClick={() => loginWithRedirect()}>
            Sign in / Create Account
          </Button>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

AuthPromptDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  message: PropTypes.string,
};

export default AuthPromptDialog;
