import { render, waitFor, act, screen } from "@testing-library/react";
import React from "react";

import { useFormsContext } from "../../../common/contexts/forms";
import { WatermarkPreview } from "./WatermarkPreview";

jest.mock("../../../common/contexts/forms");

const mockUseFormsContext = useFormsContext as jest.Mock;
const mockSetActiveFormIndex = jest.fn();
const mockSetForms = jest.fn();
const mockSetCurrentFormData = jest.fn();
const mockSetCurrentForm = jest.fn();

const whenActiveFormIsAvailable = (): void => {
  mockUseFormsContext.mockReturnValue({
    activeFormIndex: 0,
    setForms: mockSetForms,
    setActiveFormIndex: mockSetActiveFormIndex,
    setCurrentFormData: mockSetCurrentFormData,
    setCurrentForm: mockSetCurrentForm,
    forms: [
      {
        fileName: "document-1",
        data: { formData: {} },
        templateIndex: 0,
        ownership: { holderAddress: "", beneficiaryAddress: "" },
      },
      {
        fileName: "document-2",
        data: { formData: {} },
        templateIndex: 0,
        ownership: { holderAddress: "", beneficiaryAddress: "" },
      },
    ],
    currentForm: {
      fileName: "document-1",
      data: { formData: {} },
      templateIndex: 0,
      ownership: { holderAddress: "", beneficiaryAddress: "" },
    },
    currentFormTemplate: {
      name: "COO",
      type: "VERIFIABLE_DOCUMENT",
      defaults: {},
      schema: {
        type: "object",
        properties: {
          foo: { type: "string", title: "Foo Field" },
          bar: { type: "string" },
        },
      },
    },
  });
};

const mockDataUrl =
  "data:application/pdf;base64,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4PVDexOr6VAzo7n4BDghOfHix/gf754MPNl5in2q6Sf9n/a20FqKWqHW3NaJtqQ2aXtMe9/pgNOdHc4dLT+b/3z0jPaZmrPKZ0vPkc4VnJs5n3d+8kLGhfGLiReHOld0Prq05NKdrrCu3suBl69e8blyqdu9+/xVl6tnrjldO32dfb3thv2N1h67npZf7H5p6bXvbb3pcLP9luOtjr4Ffef6Xfsv3va6feWO/50bA4sG+u4uvnv/Xtw96X3e/dEHqQ9eP8x6OP1o/WPs46InCk8qnqo/rf3V+Ndmqb307KDXYM+ziGePhrhDL/+V+a9PwwXPqc8rRrRG6ketR8+M+YzderH0xfDLjJfT44W/Kf6295XRq59+d/u9Z2LJxPBr0euZP0reqL45+tb2bedk6OTTd2nvpqeK3qu+P/aB/aH7Y/THkensT/hPlZ+NP3d8CfzyeCZtZubf94Tz+wplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKWyAvSUNDQmFzZWQgNyAwIFIgXQplbmRvYmoKMiAwIG9iago8PCAvVHlwZSAvUGFnZXMgL01lZGlhQm94IFswIDAgNTk1LjI4IDg0MS44OV0gL0NvdW50IDEgL0tpZHMgWyAxIDAgUiBdID4+CmVuZG9iago4IDAgb2JqCjw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUiA+PgplbmRvYmoKNiAwIG9iagpbIDEgMCBSICAvWFlaIDAgODQxLjg5IDAgXQplbmRvYmoKOSAwIG9iago8PCAvVGl0bGUgKEJsYW5rKSAvUHJvZHVjZXIgKG1hY09TIFZlcnNpb24gMTIuNCBcKEJ1aWxkIDIxRjc5XCkgUXVhcnR6IFBERkNvbnRleHQpCi9DcmVhdG9yIChQYWdlcykgL0NyZWF0aW9uRGF0ZSAoRDoyMDIyMDgwODAwMzIwN1owMCcwMCcpIC9Nb2REYXRlIChEOjIwMjIwODA4MDAzMjA3WjAwJzAwJykKPj4KZW5kb2JqCnhyZWYKMCAxMAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAxNzcgMDAwMDAgbiAKMDAwMDAwMzEwMiAwMDAwMCBuIAowMDAwMDAwMDIyIDAwMDAwIG4gCjAwMDAwMDAyODcgMDAwMDAgbiAKMDAwMDAwMzA2NyAwMDAwMCBuIAowMDAwMDAzMjQwIDAwMDAwIG4gCjAwMDAwMDAzNTUgMDAwMDAgbiAKMDAwMDAwMzE5MSAwMDAwMCBuIAowMDAwMDAzMjgyIDAwMDAwIG4gCnRyYWlsZXIKPDwgL1NpemUgMTAgL1Jvb3QgOCAwIFIgL0luZm8gOSAwIFIgL0lEIFsgPGY2ZDk2MTkyNTY5MjNiYWFkY2QxYTdkYWU1OThiODU4Pgo8ZjZkOTYxOTI1NjkyM2JhYWRjZDFhN2RhZTU5OGI4NTg+IF0gPj4Kc3RhcnR4cmVmCjM0NzUKJSVFT0YK";

const QrURL = { links: { self: { href: "testurl" } } };
// These test are not working correctly
describe("WatermarkPreview", () => {
  it("should not render qr code until PDF is loaded", async () => {
    whenActiveFormIsAvailable();
    act(() => {
      render(<WatermarkPreview dataURL={mockDataUrl} qrURL={QrURL} />);
    });

    expect(screen.queryByTestId("qr-code-container")).toBeInTheDocument();
    expect(screen.queryByTestId("qr-code-element")).not.toBeInTheDocument();
  });

  it("should render qr code when PDF is loaded", async () => {
    whenActiveFormIsAvailable();
    act(() => {
      render(<WatermarkPreview dataURL={mockDataUrl} qrURL={QrURL} />);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("qr-code-container")).toBeInTheDocument();
      expect(screen.queryByTestId("qr-code-element")).toBeInTheDocument();
    });
  });
});
