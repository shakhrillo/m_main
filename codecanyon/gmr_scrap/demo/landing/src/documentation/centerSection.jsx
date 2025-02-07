import RightSection from "./rightSection";

function CenterSection() {
  return (
    <div class="documentation__main-content col ps-4">
      <div class="row">
        <div class="col">
          <div class="documentation__body">
            <h1 class="documentation__title">Introduction</h1>
            <p class="documentation__subtitle">
              This section offers a comprehensive overview of the project,
              detailing its purpose, key features, and goals.
            </p>
            <div>
              <p class="documentation__text">
                Introducing Trezo, a cutting-edge, multi-framework admin
                dashboard template designed with both style and functionality in
                mind. Whether you're working on small personal projects or
                large-scale web and mobile applications, Trezo provides a
                seamless experience tailored to your needs. With dedicated
                dashboard versions for:
              </p>
              <ul class="documentation__list">
                <li>Tailwind CSS</li>
                <li>Angular v18+</li>
                <li>Next.js</li>
                <li>Bootstrap</li>
                <li>SCSS</li>
              </ul>
              <h2 class="documentation__section-title">Support & Assistance</h2>
              <hr />
              <h2 class="documentation__subsection-title">
                For Existing Customers: Get Help with Setup and More
              </h2>
            </div>
          </div>
        </div>

        <RightSection />
      </div>
    </div>
  );
}

export default CenterSection;
