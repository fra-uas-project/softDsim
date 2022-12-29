from collections import namedtuple
from dash import Dash, dcc, html, Input, Output
import dash_bootstrap_components as dbc

from app.models.scenario import ScenarioConfig


app = Dash(external_stylesheets=[dbc.themes.BOOTSTRAP])
app.title = "SoftDSim Dashboard"

STRESSRED = 0
STRESSHOU = 0
STRESSERR = 0
TASKSMEET = 0
TRAINSKIL = 0
EVENTCOST = 0

# the style arguments for the sidebar. We use position:fixed and a fixed width
SIDEBAR_STYLE = {
    "position": "fixed",
    "top": 0,
    "left": 0,
    "bottom": 0,
    "width": "24rem",
    "padding": "2rem 1rem",
    "background-color": "#f8f9fa",
}

# the styles for the main content position it to the right of the sidebar and
# add some padding.
CONTENT_STYLE = {
    "margin-left": "18rem",
    "margin-right": "2rem",
    "padding": "2rem 1rem",
}

sidebar = html.Div(
    [
        html.H2("Dashboard", className="display-4"),
        html.Hr(),
        html.P("SofDSim Hyperparameter Evaluation", className="lead"),
        dbc.Row(
            [
                dbc.Col(
                    [
                        html.A("Stressreduktion: "),
                        html.A("dummy", id="sr-slider-value"),
                    ]
                ),
                dcc.Slider(
                    -0.1,
                    1,
                    0.1,
                    value=0.2,
                    id="sr-slider",
                    className="slider",
                    marks=None,
                ),
            ]
        ),
        dbc.Row(
            [
                dbc.Col(
                    [
                        html.A("Stress Stundenerhöhung: "),
                        html.A("dummy", id="ss-slider-value"),
                    ]
                ),
                dcc.Slider(
                    0,
                    1,
                    0.01,
                    value=0.15,
                    id="ss-slider",
                    className="slider",
                    marks=None,
                ),
            ]
        ),
        dbc.Row(
            [
                dbc.Col(
                    [
                        html.A("Stress Fehler Erhöhung: "),
                        html.A("dummy", id="sf-slider-value"),
                    ]
                ),
                dcc.Slider(
                    0,
                    0.2,
                    0.01,
                    value=0.01,
                    id="sf-slider",
                    className="slider",
                    marks=None,
                ),
            ]
        ),
        dbc.Row(
            [
                dbc.Col(
                    [
                        html.A("Tasks per Meeting: "),
                        html.A("dummy", id="tm-slider-value"),
                    ]
                ),
                dcc.Slider(
                    0, 100, 5, value=50, id="tm-slider", className="slider", marks=None
                ),
            ]
        ),
        dbc.Row(
            [
                dbc.Col(
                    [
                        html.A("Training Skillzuwachs: "),
                        html.A("dummy", id="ts-slider-value"),
                    ]
                ),
                dcc.Slider(
                    0,
                    10,
                    0.01,
                    value=0.1,
                    id="ts-slider",
                    className="slider",
                    marks=None,
                ),
            ]
        ),
        dbc.Row(
            [
                dbc.Col(
                    [
                        html.A("Team Event Kosten: "),
                        html.A("dummy", id="te-slider-value"),
                    ]
                ),
                dcc.Slider(
                    0,
                    10000,
                    500,
                    value=5000,
                    id="te-slider",
                    className="slider",
                    marks=None,
                ),
            ]
        ),
        dbc.Row(
            dbc.Button(
                "Simuliere Konfiguration",
                color="primary",
                className="me-1",
                id="run-btn",
            ),
        ),
    ],
    style=SIDEBAR_STYLE,
)

content = html.Div(
    [html.A("", id="main-text"),], id="page-content", style=CONTENT_STYLE
)

app.layout = html.Div([dcc.Location(id="url"), sidebar, content])

# Slider Callbacks
@app.callback(Output("te-slider-value", "children"), Input("te-slider", "value"))
def update_te_slider_label(value):
    global EVENTCOST
    EVENTCOST = value
    return str(value)


@app.callback(Output("sr-slider-value", "children"), Input("sr-slider", "value"))
def update_sr_slider_label(value):
    global STRESSRED
    STRESSERR = value
    return str(value)


@app.callback(Output("ss-slider-value", "children"), Input("ss-slider", "value"))
def update_ss_slider_label(value):
    global STRESSHOU
    STRESSHOU = value
    return str(value)


@app.callback(Output("sf-slider-value", "children"), Input("sf-slider", "value"))
def update_sf_slider_label(value):
    global STRESSERR
    STRESSERR = value
    return str(value)


@app.callback(Output("tm-slider-value", "children"), Input("tm-slider", "value"))
def update_tm_slider_label(value):
    global TASKSMEET
    TASKSMEET = value
    return str(value)


@app.callback(Output("ts-slider-value", "children"), Input("ts-slider", "value"))
def update_ts_slider_label(value):
    global TRAINSKIL
    TRAINSKIL = value
    return str(value)


# Run Button Callback
@app.callback(Output("main-text", "children"), Input("run-btn", "n_clicks"))
def press(pressed):
    config = (
        STRESSRED,
        STRESSHOU,
        STRESSERR,
        TASKSMEET,
        TRAINSKIL,
        EVENTCOST,
    )
    print(config)
    return "Hi"


if __name__ == "__main__":
    app.run_server(port=8050, debug=True)
