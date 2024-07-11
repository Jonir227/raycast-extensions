import { getPreferenceValues } from "@raycast/api";

export type Preference = {
  gheUrl: string;
  gheToken: string;
};

export const preference = getPreferenceValues<Preference>();
