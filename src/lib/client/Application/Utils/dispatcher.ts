import type { EventDispatcher } from "svelte";

const handleBookSearchRequest = (dispatch: EventDispatcher<any>, isSuccess: boolean, message: string) => {
  if (isSuccess){
    dispatch('success', {message});
  } else {
    dispatch('failed', message);
  }
};
