import {
    DialogActions,
    DialogContent,
    Dialog,
    Button,
    DialogTitle,
    DialogContentText,
} from '@mui/material'

interface Props {
    open: boolean
    itemName?: string
    onAction: () => void
    onClose: () => void
}

export const DeleteModal = ({ open, itemName = '???', onAction, onClose }: Props) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>{`Usunąć ${itemName}?`}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                {`Czy aby napewno chcesz usunąć element o nazwie ${itemName}?`}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>{'Nie'}</Button>
            <Button onClick={onAction} autoFocus>
                {'Tak'}
            </Button>
        </DialogActions>
    </Dialog>
)
