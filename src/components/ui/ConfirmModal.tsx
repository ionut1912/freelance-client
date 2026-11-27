import { Modal, Box, Typography, Button } from "@mui/material";
import { useId } from "react";

interface Props {
  open: boolean;
  handleClose: () => void;
  text: string;
  onYes: () => void;
  onNo: () => void;
}

const GenericModal = ({ open, handleClose, text, onYes, onNo }: Props) => {
  const titleId = useId();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className="flex items-center justify-center"
    >
      <Box
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white p-6 rounded-2xl shadow-lg w-96"
      >
        <Typography id={titleId} variant="h6" className="mb-4 text-center">
          {text}
        </Typography>
        <div className="flex justify-end space-x-4 mt-6">
          <Button
            variant="contained"
            color="primary"
            onClick={onYes}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Yes
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onNo}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            No
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default GenericModal;
