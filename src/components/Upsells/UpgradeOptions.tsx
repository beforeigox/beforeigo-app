import React from 'react';
import { Check, Mic, BookOpen, ChefHat, Star } from 'lucide-react';
import { upsellFeatures } from '../../utils/mockData';

const iconMap = {
  mic: Mic,
  'book-open': BookOpen,
  'chef-hat': ChefHat,
};

export function UpgradeOptions() {
  const handleUpgrade = (featureTitle: string, price: string) => {
    alert(`🎉 Upgrading to ${featureTitle} for ${price}!\n\nThis would redirect to payment processing.\nFor now, this is just a demo of the upgrade flow.`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Enhance Your Legacy</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Create an even more meaningful legacy with premium features that bring your memories to life in beautiful new ways.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {upsellFeatures.map((feature) => {
          const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
          
          return (
            <div
              key={feature.id}
              className={`relative bg-white rounded-2xl shadow-sm border-2 p-8 transition-all hover:shadow-lg ${
                feature.popular ? 'border-burgundy-300 ring-2 ring-burgundy-100' : 'border-gray-200'
              }`}
            >
              {feature.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-burgundy-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-4 ${
                  feature.popular ? 'bg-burgundy-100' : 'bg-gray-100'
                }`}>
                  <IconComponent className={`h-8 w-8 ${
                    feature.popular ? 'text-burgundy-600' : 'text-gray-600'
                  }`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="text-3xl font-bold text-gray-900">{feature.price}</div>
              </div>

              <ul className="space-y-3 mb-8">
                {feature.features.map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
                      feature.popular ? 'bg-burgundy-100' : 'bg-gray-100'
                    }`}>
                      <Check className={`h-3 w-3 ${
                        feature.popular ? 'text-burgundy-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-xl font-medium transition-colors ${
                  feature.popular
                    ? 'bg-burgundy-700 text-white hover:bg-burgundy-800'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
                onClick={() => handleUpgrade(feature.title, feature.price)}
              >
                {feature.ctaText}
              </button>
            </div>
          );
        })}
      </div>

      {/* Trust Badges */}
      <div className="mt-16 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-8">Trusted by thousands of storytellers</h3>
        <div className="flex items-center justify-center space-x-12">
          <div className="text-2xl font-bold" style={{ color: '#F4C430' }}>★★★★★</div>
          <div className="text-sm font-medium" style={{ color: '#8f1133' }}>4.9/5 from 2,000+ reviews</div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">How does Voice Clone work?</h4>
            <p className="text-gray-600">Our AI analyzes your speech patterns and creates a natural-sounding voice clone that can narrate your entire story.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">What's included in the Hardcover Print?</h4>
            <p className="text-gray-600">Premium paper, custom cover design, professional binding, and fast shipping directly to your door.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Can I add recipes later?</h4>
            <p className="text-gray-600">Yes! You can upgrade to Recipe Stories at any time and seamlessly integrate them into your existing project.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Is there a money-back guarantee?</h4>
            <p className="text-gray-600">Absolutely! We offer a 30-day money-back guarantee on all premium features.</p>
          </div>
        </div>
      </div>
    </div>
  );
}