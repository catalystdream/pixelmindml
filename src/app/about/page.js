export default function About() {
    return (
      <main className="flex min-h-screen flex-col items-center p-8">
        <div className="w-full max-w-4xl">
          <h1 className="text-4xl font-bold mb-6">About Me</h1>
          
          <div className="mb-8">
            <p className="text-xl mb-4">
              I'm an engineer specializing in scientific machine learning and dynamical systems. 
              My research focuses on using neural networks to model complex engineering phenomena.
            </p>
            <p className="text-xl mb-4">
              This blog is my way of sharing knowledge, experiments, and interactive simulations 
              that demonstrate key concepts in scientific computing and machine learning.
            </p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Research Interests</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Neural networks for engineering applications</li>
              <li>Dynamical systems modeling</li>
              <li>Scientific Machine Learning</li>
              <li>Computational simulations</li>
              <li>Physics-informed neural networks</li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Technical Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Programming Languages</h3>
                <p>Python, MATLAB, JavaScript (learning)</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Libraries & Frameworks</h3>
                <p>TensorFlow, PyTorch, SciPy, NumPy</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Engineering Tools</h3>
                <p>COMSOL, ANSYS, SolidWorks</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Web Development</h3>
                <p>Next.js, HTML, CSS</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p>You can reach me at <a href="mailto:your-email@example.com" className="text-blue-600 hover:underline">your-email@example.com</a> or connect with me on <a href="#" className="text-blue-600 hover:underline">LinkedIn</a>.</p>
          </div>
        </div>
      </main>
    )
  }