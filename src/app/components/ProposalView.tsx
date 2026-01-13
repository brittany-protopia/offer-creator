import React, { useState, useEffect } from 'react';
import { ProposalData } from '../types';
import { Timeline } from './Timeline';
import { format } from 'date-fns';
import { CheckCircle, ShieldCheck, Zap, FileText, Server, Lock, ArrowRight, ExternalLink, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

const protopiaLogo = "/logo.png"; // Replace with your logo URL or local file path

interface ProposalViewProps {
  data: ProposalData;
  isViewMode?: boolean;
}

export const ProposalView: React.FC<ProposalViewProps> = ({ data, isViewMode = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: data.currency,
    maximumFractionDigits: 0,
  });

  const formattedFee = currencyFormatter.format(data.licenseFee);

  // If not in view mode (i.e. editor mode), we are always authenticated
  useEffect(() => {
    if (!isViewMode) {
      setIsAuthenticated(true);
    }
  }, [isViewMode]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim().toLowerCase() === data.prospectName.trim().toLowerCase()) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  // Password Gate
  if (data.passwordProtection && isViewMode && !isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4" style={{ fontFamily: "'Fustat', sans-serif" }}>
        <Card className="w-full max-w-md shadow-xl border-gray-200">
          <CardHeader className="text-center space-y-2 pb-6 border-b border-gray-100">
             <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-[#3D3DF5]/10 rounded-full flex items-center justify-center text-[#3D3DF5]">
                  <Lock className="w-6 h-6" />
                </div>
             </div>
             <CardTitle className="text-xl font-bold text-gray-900">Protected Proposal</CardTitle>
             <p className="text-sm text-gray-500">
               Please enter your company name to view this proposal.
             </p>
          </CardHeader>
          <CardContent className="pt-8">
             <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                   <Label htmlFor="password">Company Name</Label>
                   <Input 
                      id="password"
                      type="text" 
                      placeholder={data.prospectName ? "e.g. Acme Corp" : "Enter company name"}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
                   />
                   {error && <p className="text-xs text-red-500 font-medium">Incorrect company name. Please try again.</p>}
                </div>
                <Button type="submit" className="w-full bg-[#3D3DF5] hover:bg-[#2b2bb8]">
                   View Proposal <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
             </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f5f5ff] via-white to-[#f0fff7] text-gray-900 selection:bg-[#3D3DF5] selection:text-white" style={{ fontFamily: "'Fustat', sans-serif" }}>
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#3D3DF5]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#26D980]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-4">
            <img src={protopiaLogo} alt="Protopia Logo" className="h-8 w-auto" />
            {data.customerLogoUrl && (
              <>
                <span className="text-gray-300 text-xl font-light">×</span>
                <img src={data.customerLogoUrl} alt="Customer Logo" className="h-8 w-auto object-contain max-w-[150px]" />
              </>
            )}
          </div>
          <div className="text-sm font-medium text-gray-500 uppercase tracking-widest border-l pl-4 border-gray-300">
             Activation Proposal
          </div>
        </header>

        {/* Hero / Offer Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3D3DF5]/5 text-[#3D3DF5] text-xs font-bold uppercase tracking-wide mb-6 border border-[#3D3DF5]/10">
              <Zap className="w-3 h-3" />
              Stained Glass Activation Credit
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-gray-900 leading-[1.1]">
              Earn back <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3D3DF5] to-[#7070FF]">100%</span> of your license fee.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Hi <span className="font-semibold text-gray-900">{data.prospectName}</span> team,
              <br className="mb-4 block"/>
              For select customers, we are introducing the <strong className="text-[#3D3DF5]">Stained Glass Activation Credit</strong>. 
              We want to recruit high-value reference use cases to promote at <strong>GTC in March</strong>.
              <br className="mb-2 block"/>
              Commit to your activation timeline within 45 days, and <strong>earn your money back</strong>—receiving a credit for your entire <span className="whitespace-nowrap font-bold text-gray-900">{formattedFee}</span> license fee.
            </p>

            {data.validUntil && (
               <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-semibold border border-amber-200">
                  <Clock className="w-4 h-4" />
                  <span>Offer valid until {format(new Date(data.validUntil), 'MMMM d, yyyy')}</span>
               </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[#3D3DF5] hover:bg-[#2b2bb8] text-white shadow-xl shadow-[#3D3DF5]/20 transition-transform hover:-translate-y-0.5">
                Accept Offer
              </Button>
              <div className="flex items-center gap-2 text-sm text-gray-500 px-4">
                <ShieldCheck className="w-4 h-4 text-[#26D980]" />
                <span>Zero Risk Guarantee</span>
              </div>
            </div>
          </div>

          {/* Value Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3D3DF5] to-[#7070FF] rounded-2xl blur-2xl opacity-20 transform rotate-3"></div>
            <Card className="relative border-0 shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-white border-b border-indigo-100/50 pb-8">
                <CardTitle className="text-center">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-widest block mb-2">Total Credit Value</span>
                  <span className="text-5xl font-black text-gray-900 tracking-tight">{formattedFee}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8 space-y-4">
                 <div className="bg-[#3D3DF5]/5 rounded-lg p-6 mb-6 border border-[#3D3DF5]/10">
                    <p className="text-lg text-[#3D3DF5] font-bold leading-relaxed">
                       Reduce your deployment risk with the full support of the Protopia AI team.
                    </p>
                 </div>

                {(data.valueBullets || []).map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-[#26D980]/10 text-[#26D980] flex items-center justify-center shrink-0">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span>{bullet}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Resources Bar */}
        {(data.resources || []).length > 0 && (
          <div className="flex flex-wrap items-center justify-start gap-4 mb-20">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-2">Resources:</span>
            {(data.resources || []).map((res, idx) => (
              <a 
                key={idx} 
                href={res.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 text-sm font-medium text-gray-600 hover:text-[#3D3DF5] hover:border-[#3D3DF5]/30 hover:shadow-md transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gray-50 text-gray-400 group-hover:bg-[#3D3DF5]/10 group-hover:text-[#3D3DF5] flex items-center justify-center transition-colors">
                   <FileText className="w-3 h-3" />
                </div>
                {res.title}
                <ExternalLink className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        )}

        {/* Timeline Section */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Path to Activation</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We've outlined a clear {data.milestones.length}-step plan to get you live. 
              Below is the collaborative timeline to achieve our joint goals.
            </p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl p-8">
            <Timeline 
              milestones={data.milestones} 
              prospectName={data.prospectName}
              startDate={data.effectiveDate}
            />
          </div>
        </section>

        {/* New License Section */}
        <section className="mb-20">
             <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
                <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#3D3DF5]" />
                        License Agreement: Single Pane of Stained Glass
                    </h3>
                </div>
                <div className="p-8 grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Server className="w-4 h-4 text-gray-400" />
                            Model Configuration
                        </h4>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                             <div className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Model Type</div>
                             <div className="text-xl font-bold text-[#3D3DF5]">{data.modelType || 'Custom Model'}</div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            This license grants the right to deploy one (1) Stained Glass Transform for the specified model type, subject to Protopia AI's standard licensing terms. Reimbursement of license fee is contingent upon completion of Stained Glass Activation Credit milestones.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-gray-400" />
                            Terms & Conditions
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#26D980] mt-1.5 shrink-0" />
                                <span>Includes standard support and maintenance for 12 months.</span>
                            </li>
                             <li className="flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#26D980] mt-1.5 shrink-0" />
                                <span>Data privacy guarantees as per the Stained Glass whitepaper.</span>
                            </li>
                             <li className="flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#26D980] mt-1.5 shrink-0" />
                                <span>Commercial use rights for the deployed application.</span>
                            </li>
                        </ul>
                    </div>
                </div>
             </div>
        </section>

        {/* Signature / Footer */}
        <footer className="border-t border-gray-200 pt-10">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
             <div className="space-y-6">
              <h3 className="font-bold text-gray-900">Ready to move forward?</h3>
              <div className="bg-gradient-to-br from-[#3D3DF5]/5 to-[#7070FF]/5 rounded-2xl border border-[#3D3DF5]/10 p-8 text-center space-y-6">
                 <p className="text-lg text-gray-800 font-medium leading-relaxed">
                   Interested? Click here to take the next step.
                 </p>
                 <Button 
                   size="lg" 
                   className="w-full sm:w-auto bg-[#3D3DF5] hover:bg-[#2b2bb8] text-white shadow-lg shadow-[#3D3DF5]/20 text-lg py-6"
                   onClick={() => window.open(data.calendlyUrl, '_blank')}
                 >
                   Accept Offer
                 </Button>
              </div>
             </div>

             <div className="space-y-2 text-right">
                <h3 className="font-bold text-gray-900">Prepared By</h3>
                <div className="pt-4">
                  <p className="text-lg font-medium text-gray-900">{data.repName}</p>
                  <p className="text-gray-500">{data.repEmail}</p>
                  <p className="text-[#3D3DF5] font-medium mt-1">Protopia Inc.</p>
                </div>
             </div>
          </div>

          <div className="text-center md:text-left text-xs text-gray-400">
            © {new Date().getFullYear()} Protopia Inc. Confidential. This proposal is valid until {format(new Date(data.validUntil || new Date()), 'MMM d, yyyy')}.
          </div>
        </footer>

      </div>
    </div>
  );
};