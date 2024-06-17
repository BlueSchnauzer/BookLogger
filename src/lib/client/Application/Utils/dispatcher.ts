import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import type { ObjectId } from "mongodb";
import type { EventDispatcher } from "svelte";

export const handleBookInfoRequest = (dispatch: EventDispatcher<any>, isSuccess: boolean, message: string, updatedItem?: BookInfo, deletedId?: ObjectId) => {
  if (isSuccess){
    dispatch('success', {message, updatedItem, deletedId});
  } else {
    dispatch('failed', message);
  }
};

export const handleBookSearchRequest = (dispatch: EventDispatcher<any>, isSuccess: boolean, message: string) => {
  if (isSuccess){
    dispatch('success', {message});
  } else {
    dispatch('failed', message);
  }
};
