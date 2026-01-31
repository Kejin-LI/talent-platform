import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';

const Landing = () => {
  return (
    <Layout>
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Kejin AI Expert Platform
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Connect high-end algorithm teams with domain experts for premium data annotation and evaluation.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/demand/dashboard"
              className="group relative flex flex-col items-center justify-center p-8 bg-white border-2 border-indigo-100 rounded-2xl hover:border-indigo-600 hover:shadow-lg transition-all duration-300 w-64 h-64"
            >
              <Briefcase className="h-12 w-12 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-gray-900">Demand Side</h3>
              <p className="mt-2 text-sm text-gray-500">For Algorithm Teams</p>
              <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Enter Dashboard <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </Link>

            <Link
              to="/supply/square"
              className="group relative flex flex-col items-center justify-center p-8 bg-white border-2 border-green-100 rounded-2xl hover:border-green-600 hover:shadow-lg transition-all duration-300 w-64 h-64"
            >
              <Users className="h-12 w-12 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-gray-900">Supply Side</h3>
              <p className="mt-2 text-sm text-gray-500">For Domain Experts</p>
              <div className="mt-4 flex items-center text-green-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Enter Task Square <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Landing;
