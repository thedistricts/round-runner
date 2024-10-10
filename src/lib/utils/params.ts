import { browser } from '$app/environment';

interface GetUrlWithParamsProps {
  when: boolean;
  with: string;
}
export function getUrlWithParams({ when: isActive, with: key }: GetUrlWithParamsProps): string {
  let newUrl = '';
  if (browser) {
    let params = new URLSearchParams();
    
    if (isActive) params.set(key, 'true');
    else params.delete(key);

    if (params.size > 0) {
      newUrl = `${window.location.pathname}?${params.toString()}`;
    } else {
      newUrl = `${window.location.pathname}`;
    }
  }
  return newUrl;
}

interface GetUrlParamsWithNewProps {
  location: string;
}

export function getUrlParamsWithNew({ location }: GetUrlParamsWithNewProps): [string, boolean] {
  let newUrl = '';
  let hasParams = false;
  if (browser) {
    const queryParams = new URLSearchParams(window.location.search);
    hasParams = queryParams.size > 0;
    newUrl = hasParams ? `${location}?${queryParams.toString()}` : location;
  }
  return [newUrl, hasParams];
}