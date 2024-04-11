import { render, screen } from "@testing-library/react";

import About from "src/components/Viewer/InformationPanel/About/About";
import InformationPanel from "src/components/Viewer/InformationPanel/InformationPanel";
import React from "react";
import { ViewerProvider, defaultState } from "src/context/viewer-context";

const props = {
  activeCanvas: "foobar",
  resources: [],
  setContentSearchResource: () => {},
};

vi.mock("src/components/Viewer/InformationPanel/About/About");
vi.mocked(About).mockReturnValue(<div data-testid="mock-about">About</div>);

describe("InformationPanel", () => {
  test("renders an element with the 'clover-viewer-information-panel' class name", () => {
    render(<InformationPanel {...props} />);
    expect(screen.getByTestId("information-panel")).toHaveClass(
      "clover-viewer-information-panel",
    );
  });

  describe("plugins", () => {
    function PanelComponent() {
      return <div>Plugin content</div>;
    }

    const demoPlugin = {
      id: "plugin",
      informationPanel: {
        component: PanelComponent,
        label: { en: ["Plugin label"] },
      },
    };

    test("renders label, does not render component by default", () => {
      render(
        <ViewerProvider
          initialState={{
            ...defaultState,
            plugins: [demoPlugin],
          }}
        >
          <InformationPanel {...props} />
        </ViewerProvider>,
      );

      expect(screen.getByText("Plugin label")).toBeInTheDocument();
      expect(screen.queryByText("Plugin content")).not.toBeInTheDocument();
    });

    test("renders component if no search and no about", async () => {
      render(
        <ViewerProvider
          initialState={{
            ...defaultState,
            configOptions: {
              informationPanel: {
                renderContentSearch: false,
                renderAbout: false,
              },
            },
            plugins: [demoPlugin],
          }}
        >
          <InformationPanel {...props} />
        </ViewerProvider>,
      );

      const userItem = await screen.findByText("Plugin content");

      expect(userItem).toBeInTheDocument();
    });
  });
});
