import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import type { ObjectId } from "mongodb";
import { createEventDispatcher } from "svelte";

export interface bookInfoDispatchParameter {
  message: string,
  updatedItem?: BookInfo,
  deletedId?: ObjectId
}

export interface bookInfoEvents {
  success: bookInfoDispatchParameter;
  failed: string;
}

export interface bookSearchEvents {
  success: string;
  failed: string;
}

export const handleBookInfoRequest = (isSuccess: boolean, message: string, updatedItem?: BookInfo, deletedId?: ObjectId) => {
  const dispatch = createEventDispatcher<bookInfoEvents>();
  if (isSuccess) {
    dispatch('success', { message, updatedItem, deletedId });
  } else {
    dispatch('failed', message);
  }
};

export const handleBookSearchRequest = (isSuccess: boolean, message: string) => {
  const dispatch = createEventDispatcher<bookSearchEvents>();
  if (isSuccess) {
    dispatch('success', message);
  } else {
    dispatch('failed', message);
  }
};
