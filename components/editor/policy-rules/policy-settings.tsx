"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import TabTitle from "../../tab-title";
import EditorSaveButton from "../editor-save-button";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import EditorWrapper from "../editor-container-wrapper";
import { updatePost } from "@/lib/actions";
import WYSIWYGEditor from "../wysiwyg-editor";
const hours = [
  "None",
  "12:00 AM",
  "01:00 AM",
  "02:00 AM",
  "03:00 AM",
  "04:00 AM",
  "05:00 AM",
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
  "11:00 PM",
];
export default function PolicySettings({ data }: { data: any }) {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const rulesData = data.propertyRules;
  const validationSchema = Yup.object().shape({
    petsAllowed: Yup.boolean(),
    eventsAllowed: Yup.boolean(),
    smokingAllowed: Yup.boolean(),
    photographyAllowed: Yup.boolean(),
    quietHoursStart: Yup.string().required(
      "Start time for quiet hours is required",
    ),

    quietHoursEnd: Yup.string().required(
      "End time for quiet hours is required",
    ),
    additionalRules: Yup.string(), // Assuming it's a string
  });

  const formik = useFormik({
    initialValues: {
      id: data.id,
      propertyRulesId: rulesData.id,

      petsAllowed: rulesData.petsAllowed,
      eventsAllowed: rulesData.eventsAllowed,
      smokingAllowed: rulesData.smokingAllowed,
      photographyAllowed: rulesData.photographyAllowed,
      additionalRules: rulesData.additionalRules,
      checkInMethod: rulesData.checkInMethod,
      quietHoursStart: rulesData.quietHoursStart,
      quietHoursEnd: rulesData.quietHoursEnd,
      standardCancellationPolicy: rulesData.standardCancellationPolicy,
      longTermCancellationPolicy: rulesData.longTermCancellationPolicy,
      interactionPreferences: rulesData.interactionPreferences,
      //   checkinWindowStart: "03:00 PM",
      //   checkinWindowEnd: "09:00 PM",
      //   checkoutTime: "11:00 AM",
      //   StandardCancelPolicy: false, // Add this field
      //   LTCancelPolicy: false, // Add this field
    },

    validationSchema: validationSchema,
    onSubmit: async (values: any) => {
      setSubmitted(false);
      setIsLoading(true);
      const transformedValues = {
        id: values.id,
        propertyRules: {
          petsAllowed: values.petsAllowed,
          eventsAllowed: values.eventsAllowed,
          smokingAllowed: values.smokingAllowed,
          photographyAllowed: values.photographyAllowed,
          quietHoursStart: values.quietHoursStart,
          quietHoursEnd: values.quietHoursEnd,
          standardCancellationPolicy: values.standardCancellationPolicy,
          interactionPreferences: "test",
          checkInMethod: "test",
          additionalRules: values.additionalRules,
        },
      };
      console.log("transformed values: " + JSON.stringify(transformedValues));
      const result = await updatePost(transformedValues as any);
      if (result) {
        console.log("Post updated successfully:", result);
        setSubmitted(true);
        setIsLoading(false);
      }
      if (!result) {
        console.error("result.error");
      } else {
        console.log(values);
      }
    },
  });

  const handleBeforeUnload = useCallback(
    (e: any) => {
      if (formik.dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    },
    [formik.dirty],
  );

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  return (
    <EditorWrapper>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <TabTitle title="Policies" desc="" />
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-sm font-medium leading-6 text-gray-900">
                Cancellation Policy
              </AccordionTrigger>
              <AccordionContent className="p-2">
                <div id="my-details-modal">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-body">
                        <TabTitle
                          title="Standard cancellation policy"
                          desc="Choose the policy that will apply to stays under 28 nights."
                        />
                        <br />
                        <RadioGroup
                          name="standardCancellationPolicy"
                          defaultValue={
                            formik.values.standardCancellationPolicy
                          }
                          onChange={(value) =>
                            formik.setFieldValue(
                              "standardCancellationPolicy",
                              value,
                            )
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Flexible" id="Flexible" />
                            <Label htmlFor="Flexible">
                              Flexible - Full refund 1 day prior to arrival
                            </Label>
                          </div>
                          <br />
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="flexibleNR"
                              id="flexibleNR"
                            />
                            <Label htmlFor="flexibleNR">
                              Flexible or Non-refundable - In addition to
                              Flexible, offer a non-refundable option—guests pay
                              10% less, but you keep your payout no matter when
                              they cancel.
                            </Label>
                          </div>
                          <br />

                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="custom" id="custom" />
                            <Label htmlFor="custom">
                              <div className="grid grid-cols-3 items-center gap-5 rounded-md bg-white p-5">
                                <span className="col-span-1">
                                  Custom Refund Policy
                                </span>
                                <div className="col-start-3 flex justify-end">
                                  <Select>
                                    <SelectTrigger className="mr-4 max-w-[205px] justify-center rounded border p-2">
                                      <SelectValue
                                        placeholder={
                                          formik.values.checkinWindowStart
                                        }
                                        onChange={formik.handleChange}
                                      ></SelectValue>
                                    </SelectTrigger>
                                    <SelectContent className="mt-2 h-[200px] max-w-[205px] rounded border shadow-lg">
                                      {hours.map((hour) => (
                                        <SelectItem value="custom" key={hour}>
                                          {hour}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Select>
                                    <SelectTrigger className="max-w-[205px] justify-center rounded border p-2">
                                      <SelectValue
                                        placeholder={
                                          formik.values.checkinWindowEnd
                                        }
                                        onChange={formik.handleChange}
                                      ></SelectValue>
                                    </SelectTrigger>
                                    <SelectContent className="mt-2 h-[200px] max-w-[205px] rounded border shadow-lg">
                                      {hours.map((hour) => (
                                        <SelectItem value="custom" key={hour}>
                                          {hour}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Moderate" id="Moderate" />
                            <Label htmlFor="Moderate">
                              Moderate - Full refund 5 days prior to arrival
                            </Label>
                          </div>
                          <br />
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="ModerateNR"
                              id="ModerateNR"
                            />
                            <Label htmlFor="ModerateNR">
                              Moderate or Non-refundable - In addition to
                              Moderate, offer a non-refundable option—guests pay
                              10% less, but you keep your payout no matter when
                              they cancel.
                            </Label>
                          </div>
                          <br />
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Firm" id="Firm" />
                            <Label htmlFor="Firm">
                              Firm - Full refund for cancellations up to 30 days
                              before check-in. If booked fewer than 30 days
                              before check-in, full refund for cancellations
                              made within 48 hours of booking and at least 14
                              days before check-in. After that, 50% refund up to
                              7 days before check-in. No refund after that.
                            </Label>
                          </div>
                          <br />
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="FirmNR" id="FirmNR" />
                            <Label htmlFor="FirmNR">
                              Firm or Non-refundable - In addition to Firm,
                              offer a non-refundable option—guests pay 10% less,
                              but you keep your payout no matter when they
                              cancel.
                            </Label>
                          </div>
                          <br />
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Strict" id="Strict" />
                            <Label htmlFor="Strict">
                              Strict - Full refund for cancellations made within
                              48 hours of booking, if the check-in date is at
                              least 14 days away. 50% refund for cancellations
                              made at least 7 days before check-in. No refunds
                              for cancellations made within 7 days of check-in.
                            </Label>
                          </div>
                          <br />
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="StrictNR" id="StrictNR" />
                            <Label htmlFor="StrictNR">
                              Strict or Non-refundable - In addition to Strict,
                              offer a non-refundable option—guests pay 10% less,
                              but you keep your payout no matter when they
                              cancel.
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="mb-5 mt-5" />
                <div id="my-details-modal">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-body">
                        <TabTitle
                          title="Long-term stay cancellation policy"
                          desc="Choose the policy that will apply to stays 28 nights or longer."
                        />
                        <br />
                        <RadioGroup
                          name="longTermCancellationPolicy"
                          defaultValue={
                            formik.values.longTermCancellationPolicy
                          }
                          onChange={(value) =>
                            formik.setFieldValue(
                              "longTermCancellationPolicy",
                              value,
                            )
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="FirmLT" id="FirmLT" />
                            <Label htmlFor="FirmLT">
                              Firm - Full refund up to 30 days before check-in.
                              After that, the first 30 days of the stay are
                              non-refundable.
                            </Label>
                          </div>
                          <br />
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="StrictLT" id="StrictLT" />
                            <Label htmlFor="StrictLT">
                              Strict - Full refund if canceled within 48 hours
                              of booking and at least 28 days before check-in.
                              After that, the first 30 days of the stay are
                              non-refundable.
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <TabTitle title="House Rules" desc="" />
          <div className="mb-5 mt-5 flex items-center justify-between text-sm font-medium leading-6 text-gray-900">
            <span>Pets Allowed</span>
            <label className="relative inline-flex cursor-pointer items-center space-x-2">
              <input
                type="checkbox"
                className="hidden"
                checked={formik.values.petsAllowed}
                onChange={() =>
                  formik.setFieldValue(
                    "petsAllowed",
                    !formik.values.petsAllowed,
                  )
                }
              />
              <div
                className={`h-6 w-12 bg-${
                  formik.values.petsAllowed ? "black" : "gray-300"
                } rounded-full p-1 transition-transform duration-300`}
              >
                <div
                  className={`h-4 w-4 transform rounded-full bg-white shadow-md ${
                    formik.values.petsAllowed
                      ? "translate-x-6"
                      : "translate-x-0"
                  }`}
                ></div>
              </div>
            </label>
          </div>
          <hr />
          <div className="mb-5 mt-5 flex items-center justify-between text-sm font-medium leading-6 text-gray-900">
            <span>Events Allowed</span>
            <label className="relative inline-flex cursor-pointer items-center space-x-2">
              <input
                type="checkbox"
                className="hidden"
                checked={formik.values.eventsAllowed}
                onChange={() =>
                  formik.setFieldValue(
                    "eventsAllowed",
                    !formik.values.eventsAllowed,
                  )
                }
              />
              <div
                className={`h-6 w-12 bg-${
                  formik.values.eventsAllowed ? "black" : "gray-300"
                } rounded-full p-1 transition-transform duration-300`}
              >
                <div
                  className={`h-4 w-4 transform rounded-full bg-white shadow-md ${
                    formik.values.eventsAllowed
                      ? "translate-x-6"
                      : "translate-x-0"
                  }`}
                ></div>
              </div>
            </label>
          </div>
          <hr />
          <div className="mb-5 mt-5 flex items-center justify-between text-sm font-medium leading-6 text-gray-900">
            <span>Smoking, vaping, e‑cigarettes allowed</span>
            <label className="relative inline-flex cursor-pointer items-center space-x-2">
              <input
                type="checkbox"
                className="hidden"
                checked={formik.values.smokingAllowed}
                onChange={() =>
                  formik.setFieldValue(
                    "smokingAllowed",
                    !formik.values.smokingAllowed,
                  )
                }
              />
              <div
                className={`h-6 w-12 bg-${
                  formik.values.smokingAllowed ? "black" : "gray-300"
                } rounded-full p-1 transition-transform duration-300`}
              >
                <div
                  className={`h-4 w-4 transform rounded-full bg-white shadow-md ${
                    formik.values.smokingAllowed
                      ? "translate-x-6"
                      : "translate-x-0"
                  }`}
                ></div>
              </div>
            </label>
          </div>
          <hr />
          <div className="mb-5 mt-5 flex items-center justify-between text-sm font-medium leading-6 text-gray-900">
            <span>Photography Allowed</span>
            <label className="relative inline-flex cursor-pointer items-center space-x-2">
              <input
                type="checkbox"
                className="hidden"
                checked={formik.values.photographyAllowed}
                onChange={() =>
                  formik.setFieldValue(
                    "photographyAllowed",
                    !formik.values.photographyAllowed,
                  )
                }
              />
              <div
                className={`h-6 w-12 bg-${
                  formik.values.photographyAllowed ? "black" : "gray-300"
                } rounded-full p-1 transition-transform duration-300`}
              >
                <div
                  className={`h-4 w-4 transform rounded-full bg-white shadow-md ${
                    formik.values.photographyAllowed
                      ? "translate-x-6"
                      : "translate-x-0"
                  }`}
                ></div>
              </div>
            </label>
          </div>
          <hr />
          <div className="mb-5 mt-5 grid grid-cols-5 gap-4 text-sm font-medium text-gray-900">
            <span className="col-span-1 col-start-1 flex items-center">
              Quiet Hours
            </span>

            {/* Start Time */}
            <div className="col-span-1 col-start-4 flex resize-none items-center">
              <select
                name="quietHoursStart"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.quietHoursStart}
                className="w-full rounded-md border p-2"
              >
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>

            {/* End Time */}
            <div className="col-span-1 col-start-5 flex items-center">
              <select
                name="quietHoursEnd"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.quietHoursEnd}
                className="w-full rounded-md border p-2"
              >
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Display form errors */}
          {formik.errors.quietHoursStart && formik.touched.quietHoursStart && (
            <div className="text-red-500">
              {JSON.stringify(formik.errors.quietHoursStart)}
            </div>
          )}
          {formik.errors.quietHoursEnd && formik.touched.quietHoursEnd && (
            <div className="text-red-500">
              {JSON.stringify(formik.errors.quietHoursEnd)}
            </div>
          )}

          {/* Display form errors */}
          {formik.errors.quietHoursStart && formik.touched.quietHoursStart && (
            <div className="text-red-500">
              {JSON.stringify(formik.errors.quietHoursStart)}
            </div>
          )}
          {formik.errors.quietHoursEnd && formik.touched.quietHoursEnd && (
            <div className="text-red-500">
              {JSON.stringify(formik.errors.quietHoursEnd)}
            </div>
          )}
          <hr />

          <div className="mb-5 mt-5 grid grid-cols-3 gap-4 text-sm font-medium text-gray-900 sm:grid-cols-5 md:grid-cols-4">
            <Label
              htmlFor="additionalRules"
              className="col-span-1 col-start-1 flex items-center"
            >
              Additional Rules
            </Label>
            <div className="col-span-3 col-start-1 flex items-center sm:col-span-5 sm:col-start-1 md:col-span-4 md:col-start-1">
              <WYSIWYGEditor formik={formik} field={"additionalRules"} />
            </div>
          </div>
          {/* Display form errors */}
          {formik.errors.additionalRules && formik.touched.additionalRules && (
            <div className="text-red-500">
              {JSON.stringify(formik.errors.additionalRules)}
            </div>
          )}
          <hr />
          <EditorSaveButton
            dirty={formik.dirty}
            submitted={submitted}
            isLoading={isLoading}
          />
        </div>
      </form>
    </EditorWrapper>
  );
}
