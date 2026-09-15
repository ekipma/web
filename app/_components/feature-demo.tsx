"use client";

import { useRef, useState } from "react";
import { Icon, type IconName } from "./icon";

const features: {
  id: string;
  name: string;
  icon: IconName;
  title: string;
  copy: string;
  points: string[];
}[] = [
  {
    id: "pay",
    name: "Share expenses",
    icon: "split",
    title: "Keep the friendship.\nSplit the bill.",
    copy: "Someone gets the groceries. Someone grabs dinner. Keep track of every shared expense, so remembering who paid isn’t a group project.",
    points: [
      "Split equally with your people",
      "Know who owes what",
      "Record and confirm repayments",
    ],
  },
  {
    id: "turn",
    name: "Take turns",
    icon: "turn",
    title: "A fair turn.\nA happier home.",
    copy: "The dishes don’t do themselves. Give recurring responsibilities a clear order, so everyone knows when it’s their turn to pitch in.",
    points: [
      "Choose who’s in the rotation",
      "Set a period for each turn",
      "Mark it done. Pass it on.",
    ],
  },
  {
    id: "plan",
    name: "Make plans",
    icon: "calendar",
    title: "Less “what’s the plan?”\nMore being there.",
    copy: "Movie night, study session, weekend escape. Keep the who, when, and where together, so a good idea becomes an actual plan.",
    points: [
      "Pick your people",
      "Add a time and a place",
      "Bring the details into your calendar",
    ],
  },
];

export function FeatureDemo() {
  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className={`feature-demo tone-${features[active].id}`}>
      <div
        className="feature-tabs"
        role="tablist"
        aria-label="Explore Ekipma features"
      >
        {features.map((item, index) => (
          <button
            key={item.id}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            role="tab"
            id={`tab-${item.id}`}
            aria-controls={`panel-${item.id}`}
            aria-selected={active === index}
            tabIndex={active === index ? 0 : -1}
            className={active === index ? "active" : ""}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              const next =
                event.key === "ArrowRight"
                  ? (index + 1) % 3
                  : event.key === "ArrowLeft"
                    ? (index + 2) % 3
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? 2
                        : null;
              if (next !== null) {
                event.preventDefault();
                setActive(next);
                tabs.current[next]?.focus();
              }
            }}
          >
            <span className="tab-number">0{index + 1}</span>
            <Icon name={item.icon} />
            <span>{item.name}</span>
            <Icon name="arrow" />
          </button>
        ))}
      </div>
      {features.map((item, index) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`panel-${item.id}`}
          aria-labelledby={`tab-${item.id}`}
          hidden={active !== index}
          tabIndex={0}
          className="feature-panel"
        >
          <div className="feature-copy">
            <span className="feature-symbol">
              <Icon name={item.icon} />
            </span>
            <h3>
              {item.title.split("\n").map((line, i) => (
                <span key={line}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </h3>
            <p>{item.copy}</p>
            <ul>
              {item.points.map((point) => (
                <li key={point}>
                  <Icon name="check" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="demo-stage">
            <span className="demo-caption">
              A LITTLE LOOK AT EVERYDAY LIFE <span>DEMO</span>
            </span>
            <div className="demo-window">
              <div className="demo-window-header">
                <span className="mini-home">
                  <Icon name="home" />
                </span>
                <div>
                  <strong>Apartment 4</strong>
                  <span>Life with your people</span>
                </div>
                <span className="mini-members">4 friends</span>
              </div>
              {item.id === "pay" ? (
                <div className="expense-demo">
                  <div className="expense-total">
                    <span>THE GROCERY RUN</span>
                    <strong>
                      $64<span>.00</span>
                    </strong>
                    <p>Paid by you · Shared by 4</p>
                  </div>
                  <div className="demo-divider" />
                  <div className="expense-people">
                    {["You", "Jules", "Sam", "Alex"].map((name, i) => (
                      <div key={name}>
                        <span className={`mini-avatar person-${i}`}>
                          {name[0]}
                        </span>
                        <span>{name}</span>
                        <strong>$16.00</strong>
                        {i === 0 ? (
                          <span className="paid-badge">Paid</span>
                        ) : (
                          <span className="share-label">Share</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="demo-bottom">
                    <Icon name="check" /> Fair shares. Clear heads.
                  </div>
                </div>
              ) : item.id === "turn" ? (
                <div className="turn-demo">
                  <div className="demo-subtitle">
                    <Icon name="turn" />
                    <span>Kitchen clean-up</span>
                    <span>Every 24h</span>
                  </div>
                  <div className="current-turn">
                    <span className="turn-avatar">{completed ? "S" : "J"}</span>
                    <span>UP NEXT</span>
                    <strong>{completed ? "Sam’s turn" : "Jules’s turn"}</strong>
                    <p>
                      {completed
                        ? "Jules did their bit. Over to Sam."
                        : "A clean kitchen is a team effort."}
                    </p>
                  </div>
                  <button
                    className="demo-action"
                    onClick={() => setCompleted(!completed)}
                  >
                    <Icon name={completed ? "turn" : "check"} />
                    {completed ? "Reset example" : "Try it: mark turn done"}
                  </button>
                  <p className="demo-feedback" role="status">
                    {completed
                      ? "Turn completed. Sam is up next!"
                      : "Jules → Sam → Alex → You"}
                  </p>
                </div>
              ) : (
                <div className="plan-demo">
                  <div className="calendar-top">
                    <span>FRIDAY PLANS</span>
                    <Icon name="calendar" />
                  </div>
                  <div className="plan-event">
                    <span className="date-square">
                      <small>FRI</small>18
                    </span>
                    <div>
                      <h4>One more movie?</h4>
                      <p>7:30 PM · Our living room</p>
                    </div>
                  </div>
                  <div className="plan-note">
                    Bring your favorite snacks.
                    <br />
                    We’ll figure out the movie together.
                  </div>
                  <div className="plan-attendees">
                    <span className="stacked-avatars">
                      {["J", "S", "A", "Y"].map((letter, i) => (
                        <i key={letter} className={`mini-avatar person-${i}`}>
                          {letter}
                        </i>
                      ))}
                    </span>
                    <span>The whole crew’s invited</span>
                  </div>
                  <div className="demo-bottom">
                    <Icon name="calendar" /> A good idea. An actual plan.
                  </div>
                </div>
              )}
            </div>
            <span className="demo-stage-note">
              {item.id === "turn"
                ? "Give the example a try. Your real chores can wait."
                : "Illustrative example. Your group, your everyday."}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
