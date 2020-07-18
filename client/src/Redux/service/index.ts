import { store } from '../../app';
import Actions from '../../Redux/Actions/actions';
import { ILoginM } from '../models';

class ReduxService {
    public static UpdateLoginM(updateM: ILoginM) {
        store.dispatch(Actions.UpdateLoginM(updateM));
    }
    public static updateUserImage(imgUrl: string) {
        store.dispatch(Actions.updateUserImage(imgUrl));
    }
}

export default ReduxService;