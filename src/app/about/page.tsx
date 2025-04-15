"use client";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">About Location Finder App</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">What is LocationFinder?</h2>
          <p className="text-gray-700 mb-4">
            LocationFinder is a web application that allows users to search for locations and view them on a map. 
            This app uses the Google Maps API to provide an accurate and interactive location search experience.
          </p>
          <p className="text-gray-700">
            With LocationFinder, you can easily search for addresses, tourist attractions, restaurants, and other locations 
            around the world. Just type the location name in the search box, and the app will display the results on the map.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Main Features</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Location search with auto-complete</li>
            <li>Interactive map view using Google Maps</li>
            <li>Clear location markers</li>
            <li>Responsive and user-friendly interface</li>
            <li>Accurate and relevant search results</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">How to Use</h2>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700">
            <li>Enter the name of the location you want to search for in the search box</li>
            <li>Select a location from the list of results that appears</li>
            <li>The map will automatically display the location you selected with a marker</li>
            <li>You can zoom in or out on the map to see more details</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
