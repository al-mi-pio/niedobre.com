import {
    DialogContentText,
    DialogTitle,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
} from '@mui/material'

interface Props {
    open: boolean
    recipeName?: string
    onAction: () => void
    onClose: () => void
}

export const RecipeModal = ({ open, recipeName = '???', onAction, onClose }: Props) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>{`Usunąć ${recipeName}?`}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                {`Czy aby napewno chcesz usunąć przepis o nazwie ${recipeName}?`}
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
