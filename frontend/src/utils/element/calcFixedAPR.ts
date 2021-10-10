/*
 * Copyright 2021 Element Finance, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ONE_YEAR_IN_SECONDS } from "../../constants/time";

export function calcFixedAPR(
  spotPrice: number,
  secondsUntilMaturity: number
): number {
  if (secondsUntilMaturity > 0) {
    const timeRemaining = secondsUntilMaturity / ONE_YEAR_IN_SECONDS;
    return ((1 - spotPrice) / timeRemaining) * 100;
  } else {
    return 0;
  }
}
