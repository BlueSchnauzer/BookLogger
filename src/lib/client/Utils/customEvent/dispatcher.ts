import type { BookInfoView } from "$lib/client/Application/Views/BookInfo";
import type { Id } from "$lib/server/Domain/ValueObjects/BookInfo/Id";
import { createEventDispatcher } from "svelte";

export interface bookInfoDispatchParameter {
  message: string,
  updatedItem?: BookInfoView,
  deletedId?: Id
}

export interface bookInfoEvents {
  success: bookInfoDispatchParameter;
  failed: string;
}

export interface bookSearchEvents {
  success: string;
  failed: string;
}

export const dispatchBookInfoRequest = (isSuccess: boolean, message: string, updatedItem?: BookInfoView, deletedId?: Id) => {
  const dispatch = createEventDispatcher<bookInfoEvents>();
  if (isSuccess) {
    dispatch('success', { message, updatedItem, deletedId });
  } else {
    dispatch('failed', message);
  }
};

export const dispatchBookSearchRequest = (isSuccess: boolean, message: string) => {
  const dispatch = createEventDispatcher<bookSearchEvents>();
  if (isSuccess) {
    dispatch('success', message);
  } else {
    dispatch('failed', message);
  }
};
