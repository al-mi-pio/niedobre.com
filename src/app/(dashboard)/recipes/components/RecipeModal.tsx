import {
    DialogContentText,
    DialogTitle,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
} from '@mui/material'

interface Props {
    which: number
    open: boolean
    recipeName?: string
    onAction: () => void
    onClose: () => void
    recipes: string[]
}

export const RecipeModal = ({
    which,
    open,
    recipeName = '???',
    onAction,
    onClose,
    recipes,
}: Props) => (
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
