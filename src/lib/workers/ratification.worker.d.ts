import { ratify } from './ratification.worker';
type Ratify = typeof ratify;
export type ExposeRatificationWorker = {
	ratify: Ratify;
};
