import { Action } from 'routing-controllers';

export function currentUserChecker(action: Action) {
    return action.request.user;
}
